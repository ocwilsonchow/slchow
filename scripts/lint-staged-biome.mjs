import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../apps/web")
const files = process.argv.slice(2).map((file) =>
  path.relative(webRoot, path.resolve(file)).split(path.sep).join("/")
)

if (files.length === 0) process.exit(0)

const result = spawnSync(
  "bunx",
  [
    "biome",
    "check",
    "--write",
    "--files-ignore-unknown=true",
    "--no-errors-on-unmatched",
    ...files,
  ],
  { cwd: webRoot, stdio: "inherit" }
)

process.exit(result.status ?? 1)
