import { isSstProduction } from "@/lib/stage"

export const FULL_STACK_QA_SLUG = "_full-stack-qa"

export const FULL_STACK_QA_SECTION_SLUGS = [
  "_full-stack-qa-api",
  "_full-stack-qa-backend",
  "_full-stack-qa-frontend",
  "_full-stack-qa-database",
  "_full-stack-qa-security",
  "_full-stack-qa-javascript",
] as const

/** Drafts: `_`-prefixed MDX is unpublished on production; visible on local and other stages. */
export function isHiddenSourcePage(path: string) {
  const file = path.split("/").pop() ?? ""
  return file.startsWith("_") && isSstProduction()
}

/** Section files that make up the combined Full-Stack Q&A note. */
export function isFullStackQaSection(pathOrSlug: string) {
  const file = (pathOrSlug.split("/").pop() ?? pathOrSlug).replace(/\.mdx$/, "")
  return file.startsWith(`${FULL_STACK_QA_SLUG}-`)
}
