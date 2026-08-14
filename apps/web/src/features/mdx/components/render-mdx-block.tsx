import { cn } from "@repo/ds"
import type { ComponentProps } from "react"
import Markdown, { type Components } from "react-markdown"
import { getMdxContent } from "@/lib/source"
import { getMDXComponents } from "."

type RenderMdxBlockProps = {
  category: string
  slug: string
  locale: string
}

export const RenderMdxBlockByPath = ({
  category,
  slug,
  locale,
  ...props
}: RenderMdxBlockProps & ComponentProps<"div">) => {
  const content = getMdxContent(category, slug, locale)
  const MDX = content?.data.body

  if (!MDX) return null

  return (
    <div
      {...props}
      className={cn(
        "grid w-full min-w-0 max-w-prose space-y-3 text-content-body",
        props.className
      )}
    >
      <MDX components={getMDXComponents()} />
    </div>
  )
}

type RenderMarkdownProps = {
  markdown: string
}

export const RenderMarkdown = ({ markdown }: RenderMarkdownProps) => {
  return (
    <Markdown components={getMDXComponents() as Components}>
      {markdown}
    </Markdown>
  )
}
