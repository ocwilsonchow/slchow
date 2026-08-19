import { docs } from "collections/server"
import type { Folder, Item, Node } from "fumadocs-core/page-tree"
import {
  getSlugs,
  type InferPageType,
  loader,
  type PageData,
} from "fumadocs-core/source"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import type { DocData, DocMethods } from "fumadocs-mdx/runtime/types"
import { fumadocsI18n } from "@/lib/fumadocs-i18n"
import {
  FULL_STACK_QA_SECTION_SLUGS,
  isFullStackQaSection,
  isHiddenSourcePage,
  isPinnedSourcePage,
  stripPinPrefix,
} from "@/lib/source-hidden"

const NOTES_CATEGORY = "notes"

/** Generated `.source/server` is `@ts-nocheck`, so assert the async doc entry shape for loader inference. */
type DocsEntry = DocMethods &
  PageData & {
    load: () => Promise<DocData>
    structuredData: () => Promise<DocData["structuredData"]>
    author?: string
    date?: string | Date
    pinned?: boolean
    category?:
      | "frontend"
      | "backend"
      | "system-design"
      | "ai"
      | "security"
      | "devops"
      | "computer-science"
      | "full-stack"
      | "personal"
  }

function storagePathFromFile(path: string) {
  const [maybeLocale, ...rest] = path.split("/")
  if (
    maybeLocale &&
    rest.length > 0 &&
    (fumadocsI18n.languages as string[]).includes(maybeLocale)
  ) {
    return rest.join("/")
  }
  return path
}

export const content = loader({
  baseUrl: "/",
  source: toFumadocsSource(docs as DocsEntry[], []),
  i18n: fumadocsI18n,
  slugs: (file) => getSlugs(storagePathFromFile(file.path)).map(stripPinPrefix),
})

export type NotesPage = InferPageType<typeof content>

export type NotesPostNode = {
  type: "post"
  page: NotesPage
}

export type NotesFolderNode = {
  type: "folder"
  name: string
  slugs: string[]
  children: NotesNode[]
}

export type NotesNode = NotesPostNode | NotesFolderNode

export { FULL_STACK_QA_SLUG, isHiddenSourcePage } from "@/lib/source-hidden"

function isNotesFolder(node: Node): node is Folder {
  return node.type === "folder" && node.$ref?.folder === NOTES_CATEGORY
}

function mapNotesNodes(
  nodes: Node[],
  parentSlugs: string[],
  locale: string
): NotesNode[] {
  const result: NotesNode[] = []

  for (const node of nodes) {
    if (node.type === "page") {
      const page = content.getNodePage(node as Item, locale)
      if (
        !page ||
        isHiddenSourcePage(page.path) ||
        isFullStackQaSection(page.path)
      ) {
        continue
      }
      result.push({ type: "post", page })
      continue
    }

    if (node.type !== "folder") continue

    const folderName =
      typeof node.name === "string"
        ? node.name
        : (node.$ref?.folder?.split("/").at(-1) ?? "folder")
    const segment =
      node.$ref?.folder?.split("/").at(-1) ??
      folderName.toLowerCase().replace(/\s+/g, "-")
    const slugs = [...parentSlugs, segment]

    result.push({
      type: "folder",
      name: folderName,
      slugs,
      children: mapNotesNodes(node.children, slugs, locale),
    })
  }

  return result
}

/** Nested notes tree for a locale, mirroring `content/[locale]/notes/**`. */
export function getNotes(locale: string): NotesNode[] {
  const tree = content.getPageTree(locale)
  const notesFolder = tree.children.find(isNotesFolder)
  if (!notesFolder) return []
  return mapNotesNodes(notesFolder.children, [], locale)
}

export function getCategoryPages(category: string, locale: string) {
  return content
    .getPages(locale)
    .filter(
      (page) =>
        page.slugs[0] === category &&
        page.slugs.length > 1 &&
        !isHiddenSourcePage(page.path) &&
        !isFullStackQaSection(page.path)
    )
}

function getSourceLocale(path: string) {
  return path.split("/")[0]
}

/** Category pages authored in this locale, excluding Fumadocs fallbacks. */
export function getNativeCategoryPages(category: string, locale: string) {
  return getCategoryPages(category, locale).filter(
    (page) => getSourceLocale(page.path) === locale
  )
}

export function getPageLocales(category: string, slug: string) {
  return fumadocsI18n.languages.filter((locale) =>
    getNativeCategoryPages(category, locale).some(
      (page) => page.slugs.slice(1).join("/") === slug
    )
  )
}

export function getNotesPage(slug: string[], locale: string) {
  const page = content.getPage([NOTES_CATEGORY, ...slug], locale)
  if (!page || isHiddenSourcePage(page.path)) return
  return page
}

export function getCategoryStaticParams(category: string) {
  return content
    .generateParams("slug", "locale")
    .filter(
      (param) =>
        param.slug[0] === category &&
        param.slug.length > 1 &&
        !isHiddenSourcePage(param.slug.at(-1) ?? "") &&
        !isFullStackQaSection(param.slug.at(-1) ?? "")
    )
    .map((param) => ({
      locale: param.locale,
      // `[slug]` is a single segment; nested paths use `/` in the segment
      slug: param.slug.slice(1).join("/"),
    }))
}

export function getNotesStaticParams() {
  return getCategoryStaticParams(NOTES_CATEGORY)
}

export function getMdxContent(category: string, slug: string, locale: string) {
  const page = content.getPage([category, slug], locale)
  if (!page || isHiddenSourcePage(page.path)) return
  return page
}

export async function loadMdxCompiled(page: NotesPage) {
  return page.data.load()
}

export async function loadFullStackQa(locale: string) {
  const sections: {
    slug: string
    body: DocData["body"]
    toc: DocData["toc"]
  }[] = []

  for (const slug of FULL_STACK_QA_SECTION_SLUGS) {
    const page = content.getPage([NOTES_CATEGORY, slug], locale)
    if (!page) continue
    const compiled = await page.data.load()
    sections.push({
      slug,
      body: compiled.body,
      toc: compiled.toc ?? [],
    })
  }

  return {
    sections,
    toc: sections.flatMap((section) => section.toc),
  }
}

const NOTES_CATEGORY_ORDER = [
  "frontend",
  "backend",
  "system-design",
  "ai",
  "security",
  "devops",
  "computer-science",
  "full-stack",
  "personal",
] as const

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

const getCategoryIndex = (category?: string) => {
  if (!category) return NOTES_CATEGORY_ORDER.length
  const index = (NOTES_CATEGORY_ORDER as readonly string[]).indexOf(category)
  return index === -1 ? NOTES_CATEGORY_ORDER.length : index
}

export function compareNotesPages(a: NotesPage, b: NotesPage) {
  const pinnedDiff =
    Number(isPinnedSourcePage(b.path)) - Number(isPinnedSourcePage(a.path))
  if (pinnedDiff !== 0) return pinnedDiff
  const categoryDiff =
    getCategoryIndex(a.data.category) - getCategoryIndex(b.data.category)
  if (categoryDiff !== 0) return categoryDiff
  return getPageDate(b.data.date) - getPageDate(a.data.date)
}

export function getSortedNotes(locale: string) {
  return getCategoryPages(NOTES_CATEGORY, locale).sort(compareNotesPages)
}

/** Next note in list order. Null on the last item. */
export function getNextNote(slug: string, locale: string) {
  const notes = getSortedNotes(locale)
  const index = notes.findIndex(
    (page) => page.slugs.slice(1).join("/") === slug
  )
  if (index === -1 || index >= notes.length - 1) return null

  const next = notes[index + 1]
  return {
    slug: next.slugs.slice(1).join("/"),
    title: next.data.title ?? "",
  }
}
