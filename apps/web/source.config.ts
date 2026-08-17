import {
  rehypeCodeDefaultOptions,
  remarkMdxMermaid,
} from "fumadocs-core/mdx-plugins"
import { pageSchema } from "fumadocs-core/source/schema"
import { defineCollections, defineConfig } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineCollections({
  type: "doc",
  dir: "../../packages/content/src",
  files: ["**/*.mdx"],
  // Lazy-compile MDX bodies so the notes route does not load every file at once.
  async: true,
  schema: pageSchema.extend({
    author: z.string().optional(),
    date: z.iso.date().or(z.date()).optional(),
    pinned: z.boolean().optional(),
    category: z
      .enum([
        "frontend",
        "backend",
        "system-design",
        "ai",
        "security",
        "devops",
        "computer-science",
        "full-stack",
        "personal",
      ])
      .optional(),
  }),
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "vesper",
      },
      addLanguageClass: true,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        {
          name: "code-block-label",
          pre(hast) {
            const lang = this.options.lang
            if (lang) {
              hast.properties["data-language"] = lang
            }
            const title = this.options.meta?.title
            if (typeof title === "string" && title.length > 0) {
              hast.properties["data-title"] = title
            }
          },
        },
      ],
    },
  },
})
