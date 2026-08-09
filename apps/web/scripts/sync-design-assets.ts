import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { basename, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = join(root, "../../packages/content/design")
const destination = join(root, "public/design-assets")

if (!existsSync(source)) {
  throw new Error(`Design assets source not found: ${source}`)
}

rmSync(destination, { recursive: true, force: true })
mkdirSync(dirname(destination), { recursive: true })
cpSync(source, destination, {
  recursive: true,
  filter: (src) => !basename(src).startsWith("."),
})

console.log(`Synced design assets → ${destination}`)
