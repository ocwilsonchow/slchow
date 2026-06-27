import { defineConfig, defineDocs } from "fumadocs-mdx/config"

export const components = defineDocs({
  dir: "../../packages/content/components",
})

export default defineConfig()
