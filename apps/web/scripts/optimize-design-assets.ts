import { readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs"
import { dirname, extname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const designsDir = join(root, "../../packages/content/design")

const RASTER_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
])

const MAX_EDGE = 2048
const WEBP_QUALITY = 85
const WEBP_EFFORT = 6

function listRasterFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listRasterFiles(path))
      continue
    }
    if (!entry.isFile()) continue
    if (!RASTER_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue
    files.push(path)
  }

  return files.sort()
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function optimizeFile(inputPath: string) {
  const before = statSync(inputPath).size
  const ext = extname(inputPath).toLowerCase()
  const stem = inputPath.slice(0, -ext.length)
  const outputPath = `${stem}.webp`
  const tempPath = `${stem}.__opt__.webp`

  const image = sharp(inputPath, { failOn: "none" }).rotate()
  const metadata = await image.metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  const alreadySmallWebp =
    ext === ".webp" && width > 0 && height > 0 && width <= MAX_EDGE && height <= MAX_EDGE

  const buffer = await image
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toBuffer()

  if (alreadySmallWebp && buffer.byteLength >= before) {
    return { inputPath, before, after: before, skipped: true as const }
  }

  writeFileSync(tempPath, buffer)

  if (inputPath !== outputPath) {
    unlinkSync(inputPath)
  }
  renameSync(tempPath, outputPath)

  return {
    inputPath,
    outputPath,
    before,
    after: buffer.byteLength,
    skipped: false as const,
  }
}

async function main() {
  const files = listRasterFiles(designsDir)
  if (files.length === 0) {
    console.log("No design raster assets found.")
    return
  }

  let beforeTotal = 0
  let afterTotal = 0
  let optimized = 0
  let skipped = 0

  for (const file of files) {
    const rel = relative(designsDir, file)
    const result = await optimizeFile(file)
    beforeTotal += result.before
    afterTotal += result.after

    if (result.skipped) {
      skipped += 1
      console.log(`skip  ${rel} (${formatBytes(result.before)})`)
      continue
    }

    optimized += 1
    const outRel = relative(designsDir, result.outputPath)
    const saved = result.before - result.after
    const pct = result.before === 0 ? 0 : (saved / result.before) * 100
    console.log(
      `ok    ${rel} → ${outRel}  ${formatBytes(result.before)} → ${formatBytes(result.after)}  (${pct.toFixed(1)}%)`
    )
  }

  const savedTotal = beforeTotal - afterTotal
  const pctTotal = beforeTotal === 0 ? 0 : (savedTotal / beforeTotal) * 100
  console.log(
    `\nDone. optimized=${optimized} skipped=${skipped}  ${formatBytes(beforeTotal)} → ${formatBytes(afterTotal)}  saved ${formatBytes(savedTotal)} (${pctTotal.toFixed(1)}%)`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
