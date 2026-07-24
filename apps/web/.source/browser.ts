// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"en/blocks/introduction.mdx": () => import("../../../packages/content/src/en/blocks/introduction.mdx?collection=docs"), "en/writings/hive.mdx": () => import("../../../packages/content/src/en/writings/hive.mdx?collection=docs"), "en/writings/things-i-believe.mdx": () => import("../../../packages/content/src/en/writings/things-i-believe.mdx?collection=docs"), }),
};
export default browserCollections;