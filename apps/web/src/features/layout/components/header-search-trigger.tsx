"use client"

import { useSearchContext } from "fumadocs-ui/contexts/search"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { MouseEvent } from "react"
import {
  playClickSoundOnKeyboardClick,
  playClickSoundOnPointerDown,
} from "@/lib/click-sound"

export function HeaderSearchTrigger() {
  const { setOpenSearch } = useSearchContext()
  const t = useTranslations("search")

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    playClickSoundOnKeyboardClick(event)
    setOpenSearch(true)
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("trigger")}
        onPointerDown={playClickSoundOnPointerDown}
        onClick={onClick}
        className="block md:hidden  rounded-full p-2"
      >
        <SearchIcon size={12} strokeWidth={3.5} aria-hidden />
      </button>
      <button
        type="button"
        aria-label={t("trigger")}
        onPointerDown={playClickSoundOnPointerDown}
        onClick={onClick}
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
