import path from "node:path"

function shQuote(value) {
  return `'${String(value).replaceAll("'", `'\\''`)}'`
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/")
}

const webRoot = toPosix(path.resolve("apps/web"))

function isWebBiomeFile(file) {
  const normalized = toPosix(path.resolve(file))
  return (
    (normalized === webRoot || normalized.startsWith(`${webRoot}/`)) &&
    /\.(?:js|jsx|ts|tsx|json|css)$/.test(normalized)
  )
}

/** @type {import("lint-staged").Configuration} */
export default {
  // Biome owns web JS/TS/JSON/CSS (runs with apps/web cwd via wrapper).
  "apps/web/**/*.{js,ts,jsx,tsx,json,css}": "bun scripts/lint-staged-biome.mjs",
  // Prettier for everything else (and web markdown). Skip web files Biome already handled.
  "*.{ts,tsx,md,mts,json}": (filenames) => {
    const files = filenames.filter((file) => !isWebBiomeFile(file))
    if (files.length === 0) return []
    return `prettier --write ${files.map(shQuote).join(" ")}`
  },
}
