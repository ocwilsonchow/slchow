import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "hk", "cn"],

  // Used when no locale matches
  defaultLocale: "en",
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
] as const satisfies ReadonlyArray<{
  id: (typeof routing.locales)[number]
  title: string
}>
