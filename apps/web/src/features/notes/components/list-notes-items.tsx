"use client"

import { useBreakpointValues } from "@repo/ds/hooks/use-breakpoint-values"
import { Link } from "@/i18n/navigation"
import { cn } from "@repo/ds"
import { ChevronRightIcon } from "lucide-react"

export type ListNoteItem = {
  url: string
  slug: string
  title: string
  category?: string
}

type ListNotesItemsProps = {
  notes: ListNoteItem[]
  totalCount: number
  preview?: boolean
  showHeading?: boolean
  notesLabel: string
  listAllLabel: string
}

const NOTES_PREVIEW_LIMIT = { base: 3, md: 5 } as const

export function ListNotesItems({
  notes,
  totalCount,
  preview = false,
  showHeading = true,
  notesLabel,
  listAllLabel,
}: ListNotesItemsProps) {
  const previewLimit = useBreakpointValues(NOTES_PREVIEW_LIMIT)
  const limit = preview ? previewLimit : notes.length
  const visibleNotes = notes.slice(0, limit)
  const hasMore = totalCount > limit

  return (
    <div className="flex flex-col gap-2 leading-tight">
      {showHeading && (
        <Link href="/notes" className="font-semibold py-1">
          <h2 className="flex items-center gap-2 group">
            {notesLabel}{" "}
            <sup className="text-content-subdued">{totalCount}</sup>
            <div className="bg-surface-alpha rounded-full text-content-subdued p-0.5 group-hover:translate-x-1 transition-transform duration-200">
              <ChevronRightIcon size={12} strokeWidth={4} />
            </div>
          </h2>
        </Link>
      )}
      <ul className="grid list-disc list-outside ml-4 gap-px">
        {visibleNotes.map((page) => (
          <li key={page.url} className="">
            <Link href={`/notes/${page.slug}`} className={linkClassName}>
              {page.title}
            </Link>
          </li>
        ))}
        {/* {hasMore ? (
          <li>
            <Link
              href="/notes"
              className={cn(
                linkClassName,
                "text-content-subdued hover:text-content-body"
              )}
            >
              {listAllLabel}{" "}
            </Link>
          </li>
        ) : null} */}
      </ul>
    </div>
  )
}

const linkClassName =
  "flex items-baseline gap-2 text-content-ink py-0.75 px-1.5 font-semibold hover:bg-surface-alpha rounded-md"
