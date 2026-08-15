"use client"

import { ChevronBadge } from "@repo/ds/components/ui/chevron-badge"
import { useBreakpointValues } from "@repo/ds/hooks/use-breakpoint-values"
import { Link } from "@/i18n/navigation"

export type ListNoteItem = {
  url: string
  slug: string
  title: string
}

type ListNotesItemsProps = {
  notes: ListNoteItem[]
  totalCount: number
  preview?: boolean
  showHeading?: boolean
  notesLabel: string
}

const NOTES_PREVIEW_LIMIT = { base: 3, md: 5 } as const

export function ListNotesItems({
  notes,
  totalCount,
  preview = false,
  showHeading = true,
  notesLabel,
}: ListNotesItemsProps) {
  const previewLimit = useBreakpointValues(NOTES_PREVIEW_LIMIT)
  const limit = preview ? previewLimit : notes.length
  const visibleNotes = notes.slice(0, limit)

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
        {visibleNotes.map((page) => (
          <li key={page.url}>
            <Link href={`/notes/${page.slug}`} className={linkClassName}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const linkClassName =
  "flex items-baseline gap-2 text-content-ink py-0.75 px-1.5 font-semibold hover:bg-surface-alpha rounded-md"
