// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"cn/blocks/introduction.mdx": () => import("../../../packages/content/src/cn/blocks/introduction.mdx?collection=docs"), "hk/blocks/introduction.mdx": () => import("../../../packages/content/src/hk/blocks/introduction.mdx?collection=docs"), "en/blocks/introduction.mdx": () => import("../../../packages/content/src/en/blocks/introduction.mdx?collection=docs"), "en/blocks/resume.mdx": () => import("../../../packages/content/src/en/blocks/resume.mdx?collection=docs"), "en/works/luthen.mdx": () => import("../../../packages/content/src/en/works/luthen.mdx?collection=docs"), "en/writings/hive.mdx": () => import("../../../packages/content/src/en/writings/hive.mdx?collection=docs"), "en/writings/things-i-believe.mdx": () => import("../../../packages/content/src/en/writings/things-i-believe.mdx?collection=docs"), }),
};
export default browserCollections;