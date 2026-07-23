import type { MDXComponents } from "mdx/types"
import { ul, MDXLink, Paragraph } from "./custom"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...components,
    ul: ul,
    a: MDXLink,
    p: Paragraph,
  }
}
