import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { structure } from "fumadocs-core/mdx-plugins"
import {
  type AdvancedIndex,
  createI18nSearchAPI,
} from "fumadocs-core/search/server"
import {
  publicResumeSlug,
  publicResumeVariant,
} from "@/features/resume/variants"
import { fumadocsI18n } from "@/lib/fumadocs-i18n"
import { createSearchTokenizer } from "@/lib/search-tokenizer"
import {
  FULL_STACK_QA_SECTION_SLUGS,
  FULL_STACK_QA_SLUG,
  isFullStackQaSection,
  isHiddenSourcePage,
  stripPinPrefix,
} from "@/lib/source-hidden"

type LocalizedSearchIndex = AdvancedIndex & {
  locale: string
}

const SEARCHABLE_CATEGORIES = new Set(["notes", "works"])
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const CONTENT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../packages/content/src"
)

async function listMdxFiles(dir: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...(await listMdxFiles(path.join(dir, entry.name), rel)))
      continue
    }
    if (entry.name.endsWith(".mdx")) files.push(rel)
  }

  return files
}

function parseFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (!match) return {}

  const data: Record<string, string> = {}
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":")
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    if (!key) continue
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }
  return data
}

function getSearchTarget(slugs: string[], pageUrl: string, locale: string) {
  const [category, slug] = slugs

  if (category && SEARCHABLE_CATEGORIES.has(category) && slugs.length > 1) {
    return {
      category,
      url: `/${locale}${pageUrl}`,
    }
  }

  if (category === "blocks" && slug === publicResumeSlug) {
    return {
      category: "resume",
      url: `/${locale}/resume/${publicResumeVariant}`,
    }
  }

  return null
}

async function buildSearchIndexes(): Promise<LocalizedSearchIndex[]> {
  const indexes: LocalizedSearchIndex[] = []
  const files = await listMdxFiles(CONTENT_ROOT)

  for (const rel of files) {
    const posix = rel.split(path.sep).join("/")
    if (isHiddenSourcePage(posix) || isFullStackQaSection(posix)) continue

    const [locale, category, ...rest] = posix.split("/")
    if (!locale || !category || rest.length === 0) continue
    if (!(fumadocsI18n.languages as string[]).includes(locale)) continue

    const slugParts = rest.map((part, index) =>
      stripPinPrefix(
        index === rest.length - 1 ? part.replace(/\.mdx$/, "") : part
      )
    )
    const slugs = [category, ...slugParts]
    const pageUrl = `/${slugs.join("/")}`
    const target = getSearchTarget(slugs, pageUrl, locale)
    if (!target) continue

    const source = await readFile(path.join(CONTENT_ROOT, rel), "utf-8")
    const matter = parseFrontmatter(source)
    const slug = slugParts.join("/")
    let markdown = source.replace(FRONTMATTER, "")

    if (slug === FULL_STACK_QA_SLUG) {
      const sections = await Promise.all(
        FULL_STACK_QA_SECTION_SLUGS.map(async (sectionSlug) => {
          const sectionPath = path.join(
            CONTENT_ROOT,
            locale,
            category,
            `${sectionSlug}.mdx`
          )
          try {
            const sectionSource = await readFile(sectionPath, "utf-8")
            return sectionSource.replace(FRONTMATTER, "")
          } catch {
            return ""
          }
        })
      )
      markdown = sections.filter(Boolean).join("\n\n")
    }

    indexes.push({
      id: target.url,
      title: matter.title ?? slugParts.at(-1) ?? posix,
      description: matter.description,
      structuredData: structure(markdown),
      url: target.url,
      tag: target.category,
      locale,
    })
  }

  return indexes
}

export const searchApi = createI18nSearchAPI("advanced", {
  i18n: fumadocsI18n,
  indexes: buildSearchIndexes,
  localeMap: Object.fromEntries(
    fumadocsI18n.languages.map((locale) => [
      locale,
      {
        components: {
          tokenizer: createSearchTokenizer(locale),
        },
      },
    ])
  ),
})
