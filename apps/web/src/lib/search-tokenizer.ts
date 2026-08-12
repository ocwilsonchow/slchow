import { create, type Tokenizer } from "@orama/orama"

const CJK_CHARACTER = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u
const WORD = /[\p{L}\p{N}_'-]+/gu

function addCjkNgrams(tokens: Set<string>, value: string) {
  const characters = Array.from(value)
  const maxSize = Math.min(3, characters.length)

  for (let size = 1; size <= maxSize; size += 1) {
    for (let index = 0; index <= characters.length - size; index += 1) {
      tokens.add(characters.slice(index, index + size).join(""))
    }
  }
}

/**
 * Orama 3's built-in language splitters do not include Chinese or Japanese.
 * This Unicode tokenizer is shared by the build-time and browser databases so
 * their serialized indexes remain compatible.
 */
export function createSearchTokenizer(locale: string): Tokenizer {
  return {
    language: locale,
    normalizationCache: new Map(),
    tokenize(raw) {
      const normalized = raw.normalize("NFKC").toLocaleLowerCase(locale)
      const tokens = new Set<string>()

      for (const match of normalized.matchAll(WORD)) {
        const value = match[0]
        tokens.add(value)

        if (CJK_CHARACTER.test(value)) {
          addCjkNgrams(tokens, value)
        }
      }

      return Array.from(tokens)
    },
  }
}

export function createSearchDatabase(locale = "en") {
  return create({
    schema: { _: "string" },
    components: {
      tokenizer: createSearchTokenizer(locale),
    },
  })
}
