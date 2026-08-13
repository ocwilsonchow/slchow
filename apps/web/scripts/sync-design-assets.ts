import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = join(root, "../../packages/content/design")
const destination = join(root, "public/design-assets")

const VARIANT_WIDTHS = [400, 800] as const
const VARIANT_RE = /\.w\d+\.webp$/i
const WEBP_QUALITY = 80
const WEBP_EFFORT = 4

if (!existsSync(source)) {
  throw new Error(`Design assets source not found: ${source}`)
}

rmSync(destination, { recursive: true, force: true })
mkdirSync(dirname(destination), { recursive: true })
cpSync(source, destination, {
  recursive: true,
  filter: (src) => !basename(src).startsWith("."),
})

const masters = listMasterWebps(destination)
await Promise.all(masters.map((file) => writeVariants(file)))

console.log(
  `Synced design assets → ${destination} (${masters.length} images, ${VARIANT_WIDTHS.join("/")}w variants)`
)

function listMasterWebps(dir: string): string[] {
  const files: string[] = []

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listMasterWebps(path))
      continue
    }
    if (!entry.isFile()) continue
    if (extname(entry.name).toLowerCase() !== ".webp") continue
    if (VARIANT_RE.test(entry.name)) continue
    files.push(path)
  }

  return files
}

async function writeVariants(inputPath: string) {
  const ext = extname(inputPath)
  const stem = inputPath.slice(0, -ext.length)

  await Promise.all(
    VARIANT_WIDTHS.map(async (width) => {
      const buffer = await sharp(inputPath, { failOn: "none" })
        .rotate()
        .resize({
          width,
          height: width,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
        .toBuffer()

      writeFileSync(`${stem}.w${width}${ext}`, buffer)
    })
  )
}
