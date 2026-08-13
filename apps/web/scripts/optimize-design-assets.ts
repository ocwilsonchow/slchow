import { execFile, execFileSync } from "node:child_process"
import {
  existsSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { dirname, extname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import sharp from "sharp"

const execFileAsync = promisify(execFile)

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
const VIDEO_EXTENSIONS = new Set([".mov", ".mp4"])

const MAX_EDGE = 2048
const VIDEO_MAX_EDGE = 1920
const WEBP_QUALITY = 85
const WEBP_EFFORT = 6

type OptimizeResult = {
  inputPath: string
  outputPath: string
  before: number
  after: number
  skipped: boolean
  extra?: string
}

function listFiles(dir: string, extensions: Set<string>): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listFiles(path, extensions))
      continue
    }
    if (!entry.isFile()) continue
    if (!extensions.has(extname(entry.name).toLowerCase())) continue
    files.push(path)
  }

  return files.sort()
}

function stemOf(path: string) {
  const ext = extname(path)
  return path.slice(0, -ext.length)
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function ensureFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" })
  } catch {
    throw new Error(
      "ffmpeg is required to optimize design videos. Install it with: brew install ffmpeg"
    )
  }
}

async function runFfmpeg(args: string[]) {
  try {
    await execFileAsync("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      ...args,
    ])
  } catch (error) {
    const err = error as { stderr?: string; message: string }
    throw new Error(err.stderr?.trim() || err.message)
  }
}

async function writeWebpFrom(inputPath: string) {
  const image = sharp(inputPath, { failOn: "none" }).rotate()
  return image
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toBuffer()
}

async function optimizeRaster(inputPath: string): Promise<OptimizeResult> {
  const before = statSync(inputPath).size
  const ext = extname(inputPath).toLowerCase()
  const outputPath = `${stemOf(inputPath)}.webp`
  const tempPath = `${stemOf(inputPath)}.__opt__.webp`

  const image = sharp(inputPath, { failOn: "none" }).rotate()
  const metadata = await image.metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  const alreadySmallWebp =
    ext === ".webp" &&
    width > 0 &&
    height > 0 &&
    width <= MAX_EDGE &&
    height <= MAX_EDGE

  const buffer = await writeWebpFrom(inputPath)

  if (alreadySmallWebp && buffer.byteLength >= before) {
    return { inputPath, outputPath, before, after: before, skipped: true }
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
    skipped: false,
  }
}

async function optimizeVideo(inputPath: string): Promise<OptimizeResult> {
  const before = statSync(inputPath).size
  const ext = extname(inputPath).toLowerCase()
  const stem = stemOf(inputPath)
  const outputMp4 = `${stem}.mp4`
  const tempMp4 = `${stem}.__opt__.mp4`
  const posterPath = `${stem}.webp`
  const posterFrame = `${stem}.__poster__.png`

  try {
    await runFfmpeg([
      "-y",
      "-i",
      inputPath,
      "-vf",
      `scale='min(${VIDEO_MAX_EDGE},iw)':'min(${VIDEO_MAX_EDGE},ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2`,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      tempMp4,
    ])

    await runFfmpeg([
      "-y",
      "-i",
      inputPath,
      "-frames:v",
      "1",
      "-update",
      "1",
      posterFrame,
    ])

    const posterBuffer = await writeWebpFrom(posterFrame)
    writeFileSync(posterPath, posterBuffer)

    const transcodedSize = statSync(tempMp4).size
    let keptMp4 = outputMp4

    if (ext === ".mov") {
      renameSync(tempMp4, outputMp4)
      unlinkSync(inputPath)
    } else if (transcodedSize < before) {
      renameSync(tempMp4, outputMp4)
    } else {
      unlinkSync(tempMp4)
      keptMp4 = inputPath
    }

    return {
      inputPath,
      outputPath: keptMp4,
      before,
      after: statSync(keptMp4).size,
      skipped: false,
      extra: `poster ${formatBytes(posterBuffer.byteLength)}`,
    }
  } finally {
    if (existsSync(posterFrame)) unlinkSync(posterFrame)
    if (existsSync(tempMp4)) unlinkSync(tempMp4)
  }
}

function logResult(result: OptimizeResult) {
  const rel = relative(designsDir, result.inputPath)

  if (result.skipped) {
    console.log(`skip  ${rel} (${formatBytes(result.before)})`)
    return
  }

  const outRel = relative(designsDir, result.outputPath)
  const saved = result.before - result.after
  const pct = result.before === 0 ? 0 : (saved / result.before) * 100
  const extra = result.extra ? `  (${result.extra})` : ""
  console.log(
    `ok    ${rel} → ${outRel}  ${formatBytes(result.before)} → ${formatBytes(result.after)}  (${pct.toFixed(1)}%)${extra}`
  )
}

async function main() {
  const videos = listFiles(designsDir, VIDEO_EXTENSIONS)
  const videoStems = new Set(videos.map(stemOf))
  const rasters = listFiles(designsDir, RASTER_EXTENSIONS).filter(
    (file) => !videoStems.has(stemOf(file))
  )

  if (videos.length === 0 && rasters.length === 0) {
    console.log("No design assets found.")
    return
  }

  if (videos.length > 0) ensureFfmpeg()

  let beforeTotal = 0
  let afterTotal = 0
  let optimized = 0
  let skipped = 0

  for (const file of videos) {
    const result = await optimizeVideo(file)
    beforeTotal += result.before
    afterTotal += result.after
    if (result.skipped) skipped += 1
    else optimized += 1
    logResult(result)
  }

  for (const file of rasters) {
    const result = await optimizeRaster(file)
    beforeTotal += result.before
    afterTotal += result.after
    if (result.skipped) skipped += 1
    else optimized += 1
    logResult(result)
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
