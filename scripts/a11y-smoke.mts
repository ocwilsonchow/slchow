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
  "/ja",
  "/ja/notes",
  "/ja/resume",
] as const

const navigationTimeoutMs = 30_000

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

      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? "")
      )

      if (serious.length > 0) {
        const summary = serious
          .map(
            (violation) =>
              `  - [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`
          )
          .join("\n")
        failures.push(`${url}:\n${summary}`)
      } else {
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

  await browser.close()

  if (failures.length > 0) {
    console.error("\nAccessibility smoke failures:\n")
    for (const failure of failures) {
      console.error(failure)
      console.error("")
    }
    process.exit(1)
  }

  console.log(`\nAll ${paths.length} a11y smoke checks passed.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
