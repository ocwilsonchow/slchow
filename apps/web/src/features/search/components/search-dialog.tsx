"use client"

import { cn } from "@repo/ds"
import { useDocsSearch } from "fumadocs-core/search/client"
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static"
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
  useSearch,
} from "fumadocs-ui/components/dialog/search"
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useMemo,
} from "react"
import { createSearchDatabase } from "@/lib/search-tokenizer"

const SEARCH_OPTIONS = {
  limit: 24,
  tolerance: 1,
  threshold: 0.1,
} as const

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-4.5 items-center justify-center rounded-md bg-surface-alpha px-1 py-px">
      {children}
    </kbd>
  )
}

function LocalizedSearchInput({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  const t = useTranslations("search")
  const { search, onSearchChange } = useSearch()

  return (
    <input
      {...props}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={t("placeholder")}
      className={cn(
        "w-0 flex-1 bg-transparent text-base focus-visible:outline-none",
        className
      )}
    />
  )
}

function getCategoryKey(url: string) {
  const section = url.split("/").filter(Boolean)[1]
  if (section === "notes" || section === "works") return section
  return "resume"
}

function SearchMessage({
  children,
  role,
  "aria-live": ariaLive,
}: {
  children: ReactNode
  role?: "alert" | "status"
  "aria-live"?: "polite" | "assertive" | "off"
}) {
  return (
    <div
      className="px-5 py-12 text-center text-sm text-content-body-on-popover"
      role={role}
      aria-live={ariaLive}
    >
      {children}
    </div>
  )
}

function SearchEmpty({ hasError }: { hasError: boolean }) {
  const t = useTranslations("search")

  return (
    <SearchMessage role={hasError ? "alert" : "status"}>
      {hasError ? t("error") : t("noResults")}
    </SearchMessage>
  )
}

function SearchResultItem({
  item,
  onClick,
}: {
  item: SearchItemType
  onClick: () => void
}) {
  return (
    <SearchDialogListItem
      item={item}
      onClick={onClick}
      role="option"
      className={cn(
        "rounded-xl px-3 py-2.5 text-content-body-on-popover aria-selected:bg-surface-alpha aria-selected:text-content-ink-on-popover",
        item.type === "heading" && "[&>svg]:hidden [&>div:last-child]:ps-4"
      )}
    />
  )
}

function SearchFooterHints() {
  const t = useTranslations("search")

  return (
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
  )
}

export function SiteSearchDialog(props: SharedProps) {
  const locale = useLocale()
  const t = useTranslations("search")

  const client = useMemo(
    () =>
      oramaStaticClient({
        // Served from S3/CDN via `public/search-index` — avoids Lambda's 6MB
        // response limit that breaks `/api/search` on OpenNext/SST.
        from: `/search-index/${locale}.json`,
        initOrama: () => createSearchDatabase(locale),
        search: SEARCH_OPTIONS,
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
          <LocalizedSearchInput
            aria-label={t("inputLabel")}
            autoComplete="off"
            autoFocus
            className="text-content-ink-on-popover placeholder:text-content-body-on-popover"
          />
          <SearchDialogClose className="inline-flex h-4.5 items-center justify-center rounded-md border-0 bg-surface-alpha px-1 py-px text-xs text-content-body-on-popover hover:text-content-ink-on-popover">
            {t("closeShort")}
          </SearchDialogClose>
        </SearchDialogHeader>

        {showPrompt ? (
          <SearchMessage aria-live="polite">{t("prompt")}</SearchMessage>
        ) : null}

        <SearchDialogList
          items={hasError ? [] : items}
          role="listbox"
          aria-label={t("resultsLabel")}
          data-lenis-prevent
          className="border-stroke-soft/75"
          Empty={() => <SearchEmpty hasError={hasError} />}
          Item={SearchResultItem}
        />

        <SearchFooterHints />
      </SearchDialogContent>
    </SearchDialog>
  )
}
