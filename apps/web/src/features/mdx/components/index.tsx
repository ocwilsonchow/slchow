import type { MDXComponents } from "mdx/types"
import { MDXLink, Pre } from "./custom"
import {
  blockquote,
  code,
  em,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  li,
  ol,
  p,
  strong,
  ul,
} from "./custom/typography"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...components,
    a: MDXLink,
    blockquote,
    code,
    em,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    li,
    ol,
    p,
    strong,
    ul,
    pre: Pre,
  }
}
