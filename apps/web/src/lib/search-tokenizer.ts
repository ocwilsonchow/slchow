import { create, type Tokenizer } from "@orama/orama"

const TOKEN_RUN =
  /(\p{Script=Han}+|\p{Script=Hiragana}+|\p{Script=Katakana}+|[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\s]+)/gu
const LATIN_WORD = /[\p{L}\p{N}_'-]+/gu

function addCjkNgrams(tokens: Set<string>, value: string) {
  const characters = Array.from(value)
  // Unigrams + bigrams keep CJK searchable without exploding the index.
  const maxSize = Math.min(2, characters.length)

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

      for (const match of normalized.matchAll(TOKEN_RUN)) {
        const value = match[0]

        if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(value)) {
          addCjkNgrams(tokens, value)
          continue
        }

        for (const word of value.matchAll(LATIN_WORD)) {
          tokens.add(word[0])
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
