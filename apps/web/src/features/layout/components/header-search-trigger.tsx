"use client"

import { useSearchContext } from "fumadocs-ui/contexts/search"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

export function HeaderSearchTrigger() {
  const { setOpenSearch } = useSearchContext()
  const t = useTranslations("search")

  return (
    <>
      <button
        type="button"
        aria-label={t("trigger")}
        onClick={() => setOpenSearch(true)}
        className="block md:hidden  rounded-full p-2"
      >
        <SearchIcon size={12} strokeWidth={3.5} aria-hidden />
      </button>
      <button
        type="button"
        aria-label={t("trigger")}
        onClick={() => setOpenSearch(true)}
        className="hidden lg:block text-content-subdued text-xs"
      >
        {t.rich("headerHint", {
          modifier: (chunks) => (
            <kbd className="bg-surface-alpha rounded-md px-1 py-px">
              {chunks}
            </kbd>
          ),
          key: (chunks) => (
            <kbd className="bg-surface-alpha rounded-md px-1 py-px">
              {chunks}
            </kbd>
          ),
        })}
      </button>
    </>
  )
}
