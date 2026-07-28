import { docs } from "collections/server"
import type { Folder, Item, Node } from "fumadocs-core/page-tree"
import { type InferPageType, loader, type PageData } from "fumadocs-core/source"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import type { DocData, DocMethods } from "fumadocs-mdx/runtime/types"
import { fumadocsI18n } from "@/lib/fumadocs-i18n"

const WRITINGS_CATEGORY = "writings"

/** Generated `.source/server` is `@ts-nocheck`, so assert the doc entry shape for loader inference. */
type DocsEntry = DocData &
  DocMethods &
  PageData & {
    author?: string
    date?: string | Date
    pinned?: boolean
  }

export const content = loader({
  baseUrl: "/",
  source: toFumadocsSource(docs as DocsEntry[], []),
  i18n: fumadocsI18n,
})

export type WritingsPage = InferPageType<typeof content>

export type WritingsPostNode = {
  type: "post"
  page: WritingsPage
}

export type WritingsFolderNode = {
  type: "folder"
  name: string
  slugs: string[]
  children: WritingsNode[]
}

export type WritingsNode = WritingsPostNode | WritingsFolderNode

function isWritingsFolder(node: Node): node is Folder {
  return node.type === "folder" && node.$ref?.folder === WRITINGS_CATEGORY
}

function mapWritingsNodes(
  nodes: Node[],
  parentSlugs: string[],
  locale: string
): WritingsNode[] {
  const result: WritingsNode[] = []

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
      children: mapWritingsNodes(node.children, slugs, locale),
    })
  }

  return result
}

/** Nested writings tree for a locale, mirroring `content/[locale]/writings/**`. */
export function getWritings(locale: string): WritingsNode[] {
  const tree = content.getPageTree(locale)
  const writingsFolder = tree.children.find(isWritingsFolder)
  if (!writingsFolder) return []
  return mapWritingsNodes(writingsFolder.children, [], locale)
}

export function getCategoryPages(category: string, locale: string) {
  return content
    .getPages(locale)
    .filter((page) => page.slugs[0] === category && page.slugs.length > 1)
}

export function getWritingsPage(slug: string[], locale: string) {
  return content.getPage([WRITINGS_CATEGORY, ...slug], locale)
}

export function getCategoryStaticParams(category: string) {
  return content
    .generateParams("slug", "locale")
    .filter(
      (param) => param.slug[0] === category && param.slug.length > 1
    )
    .map((param) => ({
      locale: param.locale,
      // `[slug]` is a single segment; nested paths use `/` in the segment
      slug: param.slug.slice(1).join("/"),
    }))
}

export function getWritingsStaticParams() {
  return getCategoryStaticParams(WRITINGS_CATEGORY)
}

export function getMdxContent(category: string, slug: string, locale: string) {
  return content.getPage([category, slug], locale)
}
