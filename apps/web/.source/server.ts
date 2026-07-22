// @ts-nocheck
import * as __fd_glob_0 from "../../../packages/content/src/en/writings/introduction.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();

export const docs = await create.doc("docs", "../../packages/content/src", {"en/writings/introduction.mdx": __fd_glob_0, });