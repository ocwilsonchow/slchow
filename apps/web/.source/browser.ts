// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"en/writings/introduction.mdx": () => import("../../../packages/content/src/en/writings/introduction.mdx?collection=docs"), }),
};
export default browserCollections;