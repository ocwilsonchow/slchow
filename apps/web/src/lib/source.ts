import { docs } from "collections/server"
import type { Folder, Item, Node } from "fumadocs-core/page-tree"
import { type InferPageType, loader, type PageData } from "fumadocs-core/source"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import type { DocData, DocMethods } from "fumadocs-mdx/runtime/types"
import { fumadocsI18n } from "@/lib/fumadocs-i18n"

const NOTES_CATEGORY = "notes"

/** Generated `.source/server` is `@ts-nocheck`, so assert the doc entry shape for loader inference. */
type DocsEntry = DocData &
  DocMethods &
  PageData & {
    author?: string
    date?: string | Date
    pinned?: boolean
    category?: "frontend" | "backend" | "ai" | "computer-science" | "personal"
  }

export const content = loader({
  baseUrl: "/",
  source: toFumadocsSource(docs as DocsEntry[], []),
  i18n: fumadocsI18n,
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
      if (!page) continue
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
    .filter((page) => page.slugs[0] === category && page.slugs.length > 1)
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
  return content.getPage([NOTES_CATEGORY, ...slug], locale)
}

export function getCategoryStaticParams(category: string) {
  return content
    .generateParams("slug", "locale")
    .filter((param) => param.slug[0] === category && param.slug.length > 1)
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
  return content.getPage([category, slug], locale)
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

/** Next note in date-descending list order (typically older). Null on the oldest. */
export function getNextNote(slug: string, locale: string) {
  const notes = getCategoryPages(NOTES_CATEGORY, locale).sort(
    (a, b) => getPageDate(b.data.date) - getPageDate(a.data.date)
  )
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
