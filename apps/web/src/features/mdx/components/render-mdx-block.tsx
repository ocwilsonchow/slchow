import Markdown, { type Components } from "react-markdown"
import { getMdxContent } from "@/lib/source"
import { getMDXComponents } from "."
import { ComponentProps } from "react"
import { cn } from "@repo/ds"

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
      className={cn("space-y-4 grid", props.className)}
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
