import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "hk", "cn", "ja"],

  // Used when no locale matches
  defaultLocale: "en",

  // Avoid Accept-Language / cookie negotiation so `/` redirects are cacheable
  localeDetection: false,
})

export const localeOptions = [
  {
    id: "en",
    title: "English",
  },
  {
    id: "hk",
    title: "繁體中文",
  },
  {
    id: "cn",
    title: "简体中文",
  },
  {
    id: "ja",
    title: "日本語",
  },
] as const satisfies ReadonlyArray<{
  id: (typeof routing.locales)[number]
  title: string
}>
