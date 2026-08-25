"use client"

import { RootProvider } from "fumadocs-ui/provider/next"
import { useLocale, useTranslations } from "next-intl"
import type { ReactNode } from "react"
import { SiteSearchDialog } from "./search-dialog"

export function SiteSearchProvider({ children }: { children: ReactNode }) {
  const locale = useLocale()
  const t = useTranslations("search")

  return (
    <RootProvider
      theme={{ enabled: false }}
      i18n={{
        locale,
        translations: {
          Search: t("title"),
          "Close Search": t("close"),
          "No results found": t("noResults"),
        },
      }}
      search={{
        SearchDialog: SiteSearchDialog,
      }}
    >
      {children}
    </RootProvider>
  )
}
