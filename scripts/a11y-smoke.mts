import AxeBuilder from "@axe-core/playwright"
import { chromium } from "playwright"

const baseUrl = process.env.A11Y_BASE_URL ?? "http://localhost:3003"
const paths = [
  "/en",
  "/en/notes",
  "/en/resume",
  "/hk",
  "/hk/notes",
  "/hk/resume",
  "/cn",
  "/cn/notes",
  "/cn/resume",
] as const

const searchCases = [
  {
    locale: "en",
    query: "Poem of Life",
    result: "A Poem of Life",
    pathname: "/en/notes/a-poem-of-life",
  },
  {
    locale: "en",
    query: "blood brightens",
    result: "A Poem of Life",
    pathname: "/en/notes/a-poem-of-life",
  },
  {
    locale: "en",
    query: "Microtask Queue",
    result: "Core JavaScript Concepts",
    pathname: "/en/notes/core-javascript-concepts",
  },
  {
    locale: "en",
    query: "Luthen",
    result: "Luthen",
    pathname: "/en/works/luthen",
  },
  {
    locale: "en",
    query: "Resume",
    result: "Resume",
    pathname: "/en/resume",
  },
  {
    locale: "hk",
    query: "人生之詩",
    result: "人生之詩",
    pathname: "/hk/notes/a-poem-of-life",
  },
  {
    locale: "cn",
    query: "人生之诗",
    result: "人生之诗",
    pathname: "/cn/notes/a-poem-of-life",
  },
] as const

const navigationTimeoutMs = 30_000

function collectSeriousViolations(
  failures: string[],
  url: string,
  results: Awaited<ReturnType<InstanceType<typeof AxeBuilder>["analyze"]>>
) {
  const serious = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? "")
  )

  if (serious.length === 0) return

  const summary = serious
    .map(
      (violation) =>
        `  - [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`
    )
    .join("\n")
  failures.push(`${url}:\n${summary}`)
}

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const failures: string[] = []

  for (const path of paths) {
    const url = new URL(path, baseUrl).toString()
    const page = await context.newPage()

    try {
      const response = await page.goto(url, {
        timeout: navigationTimeoutMs,
        waitUntil: "networkidle",
      })

      if (!response || !response.ok()) {
        failures.push(
          `${url}: navigation failed (${response?.status() ?? "no response"})`
        )
        continue
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
      const failureCount = failures.length
      collectSeriousViolations(failures, url, results)

      if (failures.length === failureCount) {
        console.log(`PASS ${url}`)
      }
    } catch (error) {
      failures.push(
        `${url}: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      await page.close()
    }
  }

  const searchShortcut = process.platform === "darwin" ? "Meta+k" : "Control+k"

  for (const searchCase of searchCases) {
    const url = new URL(`/${searchCase.locale}`, baseUrl).toString()
    const page = await context.newPage()

    try {
      await page.goto(url, {
        timeout: navigationTimeoutMs,
        waitUntil: "networkidle",
      })
      await page.keyboard.press(searchShortcut)

      const dialog = page.getByRole("dialog")
      const input = dialog.locator("input").first()
      await input.waitFor({ state: "visible", timeout: navigationTimeoutMs })

      const hasAccessibleName = Boolean(await input.getAttribute("aria-label"))
      const isFocused = await input.evaluate(
        (element) => document.activeElement === element
      )
      if (!hasAccessibleName || !isFocused) {
        failures.push(
          `${url}: search input must have an accessible name and receive focus`
        )
      }

      await input.fill(searchCase.query)
      const result = dialog
        .getByRole("option", {
          name: new RegExp(
            searchCase.result.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
          ),
        })
        .first()
      await result.waitFor({ state: "visible", timeout: navigationTimeoutMs })

      if (searchCase === searchCases[0]) {
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze()
        collectSeriousViolations(failures, `${url} (search open)`, results)
      }

      await page.keyboard.press("Escape")
      await dialog.waitFor({ state: "hidden", timeout: navigationTimeoutMs })
      await page.keyboard.press(searchShortcut)
      await result.waitFor({ state: "visible", timeout: navigationTimeoutMs })
      await result.click()
      await page.waitForURL(`**${searchCase.pathname}`, {
        timeout: navigationTimeoutMs,
      })

      console.log(`PASS search ${searchCase.locale}: ${searchCase.query}`)
    } catch (error) {
      failures.push(
        `${url} search "${searchCase.query}": ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    } finally {
      await page.close()
    }
  }

  await browser.close()

  if (failures.length > 0) {
    console.error("\nAccessibility smoke failures:\n")
    for (const failure of failures) {
      console.error(failure)
      console.error("")
    }
    process.exit(1)
  }

  console.log(
    `\nAll ${paths.length} page and ${searchCases.length} search checks passed.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
