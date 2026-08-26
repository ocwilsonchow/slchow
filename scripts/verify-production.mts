import { chromium, type Page } from "playwright"

const productionUrl = process.env.PRODUCTION_URL ?? "https://slchow.com"
const sitemapUrl = new URL("/sitemap.xml", productionUrl)
const basicAuthUser = process.env.BASIC_AUTH_USER
const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD
const hasBasicAuth = Boolean(basicAuthUser && basicAuthPassword)
const basicAuthHeader = hasBasicAuth
  ? `Basic ${Buffer.from(`${basicAuthUser}:${basicAuthPassword}`).toString("base64")}`
  : undefined
const navigationTimeoutMs = 30_000
const renderSettleMs = 500
const interPageDelayMs = 750
const maxRateLimitRetries = 3

class SkipVerify extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SkipVerify"
  }
}

type CheckResult = {
  url: string
  errors: string[]
}

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
}

async function getSitemapUrls() {
  let response = null

  for (let attempt = 0; attempt <= maxRateLimitRetries; attempt++) {
    response = await fetch(sitemapUrl.href, {
      headers: basicAuthHeader ? { Authorization: basicAuthHeader } : undefined,
    })

    if (response.status !== 429 || attempt === maxRateLimitRetries) {
      break
    }

    const retryAfterMs = 5_000 * 2 ** attempt
    console.warn(
      `RETRY ${sitemapUrl.href} after HTTP 429 (${retryAfterMs / 1_000}s)`
    )
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs))
  }

  if (response?.status === 401 && !hasBasicAuth) {
    throw new SkipVerify(
      `Skipping site verify: ${sitemapUrl.href} returned 401. Set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD for this environment.`
    )
  }

  if (!response?.ok) {
    throw new Error(
      `Could not load ${sitemapUrl.href}: ${response?.status ?? "no response"} ${response?.statusText ?? ""}`.trim()
    )
  }

  const sitemap = await response.text()
  const urls = Array.from(
    sitemap.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g),
    (match) => decodeXml(match[1])
  )

  if (urls.length === 0) {
    throw new Error(`No page URLs were found in ${sitemapUrl}`)
  }

  return [...new Set(urls)]
}

async function checkPage(page: Page, url: string): Promise<CheckResult> {
  const errors: string[] = []

  page.on("console", (message) => {
    const text = message.text()
    const isBlockedPrefetch = text.includes("net::ERR_BLOCKED_BY_CLIENT")

    if (message.type() === "error" && !isBlockedPrefetch) {
      errors.push(`Console error: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => {
    errors.push(`Page error: ${error.message}`)
  })

  try {
    let response = null

    for (let attempt = 0; attempt <= maxRateLimitRetries; attempt++) {
      response = await page.goto(url, {
        timeout: navigationTimeoutMs,
        waitUntil: "load",
      })

      if (response?.status() !== 429 || attempt === maxRateLimitRetries) {
        break
      }

      errors.length = 0
      const retryAfterSeconds = Number(response.headers()["retry-after"])
      const retryAfterMs = Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds * 1_000
        : 5_000 * 2 ** attempt

      console.warn(
        `RETRY ${url} after HTTP 429 (${Math.ceil(retryAfterMs / 1_000)}s)`
      )
      await page.waitForTimeout(retryAfterMs)
    }

    if (!response) {
      errors.push("Navigation did not return an HTTP response")
    } else if (!response.ok()) {
      errors.push(`Navigation returned HTTP ${response.status()}`)
    }

    await page.waitForTimeout(renderSettleMs)

    const bodyText = await page.locator("body").innerText({
      timeout: navigationTimeoutMs,
    })

    if (bodyText.trim().length === 0) {
      errors.push("Rendered body is empty")
    }
  } catch (error) {
    errors.push(
      `Navigation failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  return { url, errors: [...new Set(errors)] }
}

async function main() {
  const urls = await getSitemapUrls()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext(
    hasBasicAuth
      ? {
          httpCredentials: {
            username: basicAuthUser as string,
            password: basicAuthPassword as string,
          },
        }
      : undefined
  )
  const results: CheckResult[] = []

  await context.route("**/*", async (route) => {
    const headers = route.request().headers()
    const isPrefetch =
      headers["next-router-prefetch"] === "1" ||
      headers.purpose === "prefetch" ||
      headers["sec-purpose"]?.includes("prefetch")

    if (isPrefetch) {
      await route.abort("blockedbyclient")
    } else {
      await route.continue()
    }
  })

  console.log(`Checking ${urls.length} pages from ${sitemapUrl.href}\n`)

  try {
    for (const [index, url] of urls.entries()) {
      const page = await context.newPage()

      try {
        const result = await checkPage(page, url)
        results.push(result)

        if (result.errors.length === 0) {
          console.log(`PASS ${url}`)
        } else {
          console.error(`FAIL ${url}`)
          for (const error of result.errors) {
            console.error(`  - ${error}`)
          }
        }
      } finally {
        await page.close()
      }

      if (index < urls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, interPageDelayMs))
      }
    }
  } finally {
    await context.close()
    await browser.close()
  }

  const failures = results.filter((result) => result.errors.length > 0)

  console.log(
    `\nChecked ${results.length} pages: ${results.length - failures.length} passed, ${failures.length} failed.`
  )

  if (failures.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  if (error instanceof SkipVerify) {
    console.warn(error.message)
    return
  }

  console.error(
    `Site verification failed: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exitCode = 1
})
