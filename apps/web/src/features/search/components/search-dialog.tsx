"use client"

import { useDocsSearch } from "fumadocs-core/search/client"
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static"
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search"
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type ReactNode, useMemo } from "react"
import { createSearchDatabase } from "@/lib/search-tokenizer"

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-stroke-soft/75 bg-surface-alpha px-1 font-mono text-[10px] leading-none text-content-ink-on-popover">
      {children}
    </kbd>
  )
}

function getCategoryKey(url: string) {
  if (url.includes("/notes/")) return "notes"
  if (url.includes("/works/")) return "works"
  return "resume"
}

export function SiteSearchDialog(props: SharedProps) {
  const locale = useLocale()
  const t = useTranslations("search")
  const client = useMemo(
    () =>
      oramaStaticClient({
        locale,
        initOrama: createSearchDatabase,
        search: {
          limit: 24,
          tolerance: 1,
          threshold: 0.1,
        },
      }),
    [locale]
  )
  const { search, setSearch, query } = useDocsSearch({
    client,
    delayMs: 80,
  })

  const items = useMemo(() => {
    if (query.data === "empty" || !query.data) return null

    return query.data.map((item) => ({
      ...item,
      breadcrumbs: [
        t(`categories.${getCategoryKey(item.url)}`),
        ...(item.breadcrumbs ?? []),
      ],
    }))
  }, [query.data, t])

  const hasError = Boolean(query.error)
  const showPrompt = query.data === "empty" && search.length === 0

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
    >
      <SearchDialogOverlay className="bg-surface-backdrop/75 backdrop-blur-md" />
      <SearchDialogContent className="top-3 md:top-[calc(50%-250px)] max-w-2xl rounded-xl border-stroke-soft/75 bg-surface-popover text-content-ink-on-popover shadow-2xl">
        <SearchDialogHeader className="gap-3 border-stroke-soft/75 p-3">
          <SearchDialogIcon
            className="text-content-body-on-popover size-4"
            aria-hidden
          />
          <SearchDialogInput
            aria-label={t("inputLabel")}
            autoComplete="off"
            className="text-content-ink-on-popover placeholder:text-content-body-on-popover"
            placeholder={t("placeholder")}
          />
          <SearchDialogClose className="border-stroke-soft/75 bg-surface-alpha text-content-body-on-popover hover:text-content-ink-on-popover text-xs px-1 py-0.5">
            {t("closeShort")}
          </SearchDialogClose>
        </SearchDialogHeader>

        {showPrompt ? (
          <div
            className="px-5 py-12 text-center text-sm text-content-body-on-popover"
            aria-live="polite"
          >
            {t("prompt")}
          </div>
        ) : null}

        <SearchDialogList
          items={hasError ? [] : items}
          role="listbox"
          aria-label={t("resultsLabel")}
          data-lenis-prevent
          className="border-stroke-soft/75"
          Empty={() => (
            <div
              className="px-5 py-12 text-center text-sm text-content-body-on-popover"
              role={hasError ? "alert" : "status"}
            >
              {hasError ? t("error") : t("noResults")}
            </div>
          )}
          Item={({ item, onClick }) => (
            <SearchDialogListItem
              item={item}
              onClick={onClick}
              role="option"
              className={`rounded-xl px-3 py-2.5 text-content-body-on-popover aria-selected:bg-surface-alpha aria-selected:text-content-ink-on-popover ${
                item.type === "heading"
                  ? "[&>svg]:hidden [&>div:last-child]:ps-4"
                  : ""
              }`}
            />
          )}
        />

        <SearchDialogFooter className="flex items-center justify-between border-stroke-soft/75 px-4 py-3 text-xs text-content-body-on-popover">
          <span className="inline-flex flex-wrap items-center gap-1">
            {t.rich("navigateHint", {
              up: (label) => (
                <Kbd>
                  <ArrowUpIcon size={12} aria-hidden />
                  <span className="sr-only">{label}</span>
                </Kbd>
              ),
              down: (label) => (
                <Kbd>
                  <ArrowDownIcon size={12} aria-hidden />
                  <span className="sr-only">{label}</span>
                </Kbd>
              ),
              enter: (label) => (
                <Kbd>
                  <CornerDownLeftIcon size={12} aria-hidden />
                  <span className="sr-only">{label}</span>
                </Kbd>
              ),
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            {t.rich("shortcutHint", {
              modifier: (key) => <Kbd>{key}</Kbd>,
              key: (key) => <Kbd>{key}</Kbd>,
            })}
          </span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
