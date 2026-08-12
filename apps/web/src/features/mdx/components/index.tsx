import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ds/components/ui/accordion"
import type { MDXComponents } from "mdx/types"
import type { ComponentProps } from "react"
import { MotionCollections } from "@/features/motion/components/collections"
import { MDXImage, MDXLink, Mermaid, Pre } from "./custom"
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
  table,
  tbody,
  td,
  th,
  thead,
  tr,
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
    table,
    thead,
    tbody,
    tr,
    th,
    td,
    ul,
    pre: Pre,
    img: (props) => (
      <MDXImage {...(props as ComponentProps<typeof MDXImage>)} />
    ),
    Mermaid,
    MotionCollections,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  }
}
