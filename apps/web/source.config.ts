import { pageSchema } from "fumadocs-core/source/schema";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineCollections({
  type: "doc",
  dir: "../../packages/content/src",
  files: ["**/*.mdx"],
  schema: pageSchema.extend({
    author: z.string().optional(),
    date: z.iso.date().or(z.date()).optional(),
    pinned: z.boolean().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "vesper",
      },
    },
  },
});
