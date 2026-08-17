import { cn } from "@repo/ds"
import type { ComponentProps } from "react"
import Markdown, { type Components } from "react-markdown"
import {
  FULL_STACK_QA_SLUG,
  getMdxContent,
  loadFullStackQa,
  loadMdxCompiled,
} from "@/lib/source"
import { getMDXComponents } from "."

type RenderMdxBlockProps = {
  category: string
  slug: string
  locale: string
}

export const RenderMdxBlockByPath = async ({
  category,
  slug,
  locale,
  ...props
}: RenderMdxBlockProps & ComponentProps<"div">) => {
  const components = getMDXComponents()
  const sections =
    category === "notes" && slug === FULL_STACK_QA_SLUG
      ? (await loadFullStackQa(locale)).sections
      : await (async () => {
          const content = getMdxContent(category, slug, locale)
          if (!content) return []
          const compiled = await loadMdxCompiled(content)
          return compiled.body ? [{ slug, body: compiled.body }] : []
        })()

  if (sections.length === 0) return null

  return (
    <div
      {...props}
      className={cn(
        "grid w-full min-w-0 max-w-prose space-y-3 text-content-body",
        props.className
      )}
    >
      {sections.map(({ slug: sectionSlug, body: MDX }) => (
        <MDX key={sectionSlug} components={components} />
      ))}
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
