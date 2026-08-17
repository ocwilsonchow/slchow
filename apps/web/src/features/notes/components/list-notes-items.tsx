"use client"

import { ChevronBadge } from "@repo/ds/components/ui/chevron-badge"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export type ListNoteCategory =
  | "frontend"
  | "backend"
  | "ai"
  | "security"
  | "devops"
  | "computer-science"
  | "full-stack"
  | "personal"

export type ListNoteItem = {
  url: string
  slug: string
  title: string
  category?: ListNoteCategory
}

type ListNotesItemsProps = {
  notes: ListNoteItem[]
  totalCount: number
  preview?: boolean
  showHeading?: boolean
  notesLabel: string
}

const NOTES_PREVIEW_MOBILE = 3
const NOTES_PREVIEW_DESKTOP = 5

export function ListNotesItems({
  notes,
  totalCount,
  preview = false,
  showHeading = true,
  notesLabel,
}: ListNotesItemsProps) {
  const t = useTranslations("notes")
  const visibleNotes = preview ? notes.slice(0, NOTES_PREVIEW_DESKTOP) : notes

  return (
    <div className="flex flex-col gap-2 leading-tight">
      {showHeading && (
        <Link href="/notes" className="font-semibold py-1">
          <h2 className="flex items-center gap-2 group">
            {notesLabel}{" "}
            <sup className="text-content-subdued">{totalCount}</sup>
            <ChevronBadge />
          </h2>
        </Link>
      )}
      <ul className="grid list-disc list-outside ml-4 gap-px">
        {visibleNotes.map((page, index) => (
          <li
            key={page.url}
            className={
              preview && index >= NOTES_PREVIEW_MOBILE
                ? "max-md:hidden"
                : undefined
            }
          >
            <Link href={`/notes/${page.slug}`} className={linkClassName}>
              <span>{page.title}</span>
              {page.category ? (
                <span className="inline-block font-semibold text-content-body/80 text-[11px] bg-surface-alpha px-1.25 py-px rounded-md">
                  {t(`categories.${page.category}`)}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const linkClassName =
  "block items-baseline space-x-2 text-content-ink py-0.75 px-1.5 font-semibold hover:bg-surface-alpha rounded-md"
