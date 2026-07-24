// @ts-nocheck
import * as __fd_glob_2 from "../../../packages/content/src/en/writings/things-i-believe.mdx?collection=docs"
import * as __fd_glob_1 from "../../../packages/content/src/en/writings/hive.mdx?collection=docs"
import * as __fd_glob_0 from "../../../packages/content/src/en/blocks/introduction.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();

export const docs = await create.doc("docs", "../../packages/content/src", {"en/blocks/introduction.mdx": __fd_glob_0, "en/writings/hive.mdx": __fd_glob_1, "en/writings/things-i-believe.mdx": __fd_glob_2, });