// @ts-nocheck
import * as __fd_glob_6 from "../../../packages/content/src/en/writings/things-i-believe.mdx?collection=docs"
import * as __fd_glob_5 from "../../../packages/content/src/en/writings/hive.mdx?collection=docs"
import * as __fd_glob_4 from "../../../packages/content/src/en/works/luthen.mdx?collection=docs"
import * as __fd_glob_3 from "../../../packages/content/src/en/blocks/resume.mdx?collection=docs"
import * as __fd_glob_2 from "../../../packages/content/src/en/blocks/introduction.mdx?collection=docs"
import * as __fd_glob_1 from "../../../packages/content/src/hk/blocks/introduction.mdx?collection=docs"
import * as __fd_glob_0 from "../../../packages/content/src/cn/blocks/introduction.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();

export const docs = await create.doc("docs", "../../packages/content/src", {"cn/blocks/introduction.mdx": __fd_glob_0, "hk/blocks/introduction.mdx": __fd_glob_1, "en/blocks/introduction.mdx": __fd_glob_2, "en/blocks/resume.mdx": __fd_glob_3, "en/works/luthen.mdx": __fd_glob_4, "en/writings/hive.mdx": __fd_glob_5, "en/writings/things-i-believe.mdx": __fd_glob_6, });