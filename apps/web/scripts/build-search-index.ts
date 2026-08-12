import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { searchApi } from "../src/lib/search"

type I18nExportedData = {
  type: "i18n"
  data: Record<string, unknown>
}

async function main() {
  const exported = (await searchApi.export()) as I18nExportedData

  if (exported.type !== "i18n" || !exported.data) {
    throw new Error("Expected an i18n search export")
  }

  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
  const outDir = path.join(root, "public/search-index")
  await mkdir(outDir, { recursive: true })

  await Promise.all(
    Object.entries(exported.data).map(async ([locale, data]) => {
      const filePath = path.join(outDir, `${locale}.json`)
      await writeFile(filePath, JSON.stringify(data))
      console.log(`Wrote ${filePath}`)
    })
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
