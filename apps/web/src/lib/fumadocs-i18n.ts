import { defineI18n } from "fumadocs-core/i18n"

export const fumadocsI18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "zh-cn", "zh-hk"],
  parser: "dir",
  fallbackLanguage: "en",
  // next-intl owns the /[locale] prefix — keep Fumadocs URLs unprefixed
  hideLocale: "always",
})
