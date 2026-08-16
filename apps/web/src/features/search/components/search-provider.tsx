"use client"

import { RootProvider } from "fumadocs-ui/provider/next"
import { useLocale, useTranslations } from "next-intl"
import { lazy, type ReactNode, useEffect } from "react"
import { playClickSound } from "@/lib/click-sound"

const SiteSearchDialog = lazy(() =>
  import("./search-dialog").then((m) => ({ default: m.SiteSearchDialog }))
)

function isSearchHotKey(event: KeyboardEvent) {
  return (event.metaKey || event.ctrlKey) && event.key === "k"
}

export function SiteSearchProvider({ children }: { children: ReactNode }) {
  const locale = useLocale()
  const t = useTranslations("search")

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSearchHotKey(event)) return
      playClickSound()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

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
        preload: false,
      }}
    >
      {children}
    </RootProvider>
  )
}
