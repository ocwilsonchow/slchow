import { en, zh_cn, zh_hk } from "@slchow/intl"
import { type Formats, hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing } from "@/i18n/routing"

const messageCatalog = {
  en,
  "zh-cn": zh_cn,
  "zh-hk": zh_hk,
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: messageCatalog[locale],
  }
})

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 5,
    },
  },
  list: {
    enumeration: {
      style: "long",
      type: "conjunction",
    },
  },
  displayName: {
    region: {
      type: "region",
    },
  },
} satisfies Formats
