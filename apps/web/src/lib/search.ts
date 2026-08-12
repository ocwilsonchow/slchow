import {
  type AdvancedIndex,
  createI18nSearchAPI,
} from "fumadocs-core/search/server"
import { fumadocsI18n } from "@/lib/fumadocs-i18n"
import { createSearchTokenizer } from "@/lib/search-tokenizer"
import { content } from "@/lib/source"

type LocalizedSearchIndex = AdvancedIndex & {
  locale: string
}

const SEARCHABLE_CATEGORIES = new Set(["notes", "works"])
const RESUME_SLUG = "resume-v2"

function getSearchTarget(slugs: string[], pageUrl: string, locale: string) {
  const [category, slug] = slugs

  if (category && SEARCHABLE_CATEGORIES.has(category) && slugs.length > 1) {
    return {
      category,
      url: `/${locale}${pageUrl}`,
    }
  }

  if (category === "blocks" && slug === RESUME_SLUG) {
    return {
      category: "resume",
      url: `/${locale}/resume`,
    }
  }

  return null
}

async function buildSearchIndexes(): Promise<LocalizedSearchIndex[]> {
  const indexes: LocalizedSearchIndex[] = []

  for (const { language, pages } of content.getLanguages()) {
    for (const page of pages) {
      const target = getSearchTarget(page.slugs, page.url, language)
      if (!target) continue

      const structuredData =
        typeof page.data.structuredData === "function"
          ? await page.data.structuredData()
          : page.data.structuredData

      if (!structuredData) {
        throw new Error(
          `Cannot build search index for "${page.path}": structured MDX data is missing.`
        )
      }

      indexes.push({
        id: target.url,
        title: page.data.title ?? page.slugs.at(-1) ?? page.path,
        description: page.data.description,
        structuredData,
        url: target.url,
        tag: target.category,
        locale: language,
      })
    }
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
