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

const PIN_PREFIX = "*"

function sourceFileStem(pathOrSlug: string) {
  return (pathOrSlug.split("/").pop() ?? pathOrSlug).replace(/\.mdx$/, "")
}

/** Drafts: `_`-prefixed MDX is unpublished on production; visible on local and other stages. */
export function isHiddenSourcePage(path: string) {
  const file = path.split("/").pop() ?? ""
  return file.startsWith("_") && isSstProduction()
}

/** Pinned notes: `*`-prefixed MDX sorts first; the prefix is not part of the slug. */
export function isPinnedSourcePage(path: string) {
  return sourceFileStem(path).startsWith(PIN_PREFIX)
}

export function stripPinPrefix(segment: string) {
  return segment.startsWith(PIN_PREFIX)
    ? segment.slice(PIN_PREFIX.length)
    : segment
}

/** Section files that make up the combined Full-Stack Q&A note. */
export function isFullStackQaSection(pathOrSlug: string) {
  return sourceFileStem(pathOrSlug).startsWith(`${FULL_STACK_QA_SLUG}-`)
}
