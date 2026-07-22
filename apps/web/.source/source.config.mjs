// source.config.ts
import { pageSchema } from "fumadocs-core/source/schema";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
var docs = defineCollections({
  type: "doc",
  dir: "../../packages/content/src",
  files: ["**/*.mdx"],
  schema: pageSchema.extend({
    author: z.string().optional(),
    date: z.iso.date().or(z.date()).optional()
  })
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs
};
