"use client"

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
  limit?: number
  showHeading?: boolean
  notesLabel: string
  listAllLabel: string
}

const RESPONSIVE_LIMIT = { base: 3, md: 5 } as const

export function ListNotesItems({
  notes,
  totalCount,
  limit: fixedLimit,
  showHeading = true,
  notesLabel,
  listAllLabel,
}: ListNotesItemsProps) {
  const responsiveLimit = useBreakpointValues(RESPONSIVE_LIMIT)
  const limit = fixedLimit ?? responsiveLimit
  const visibleNotes = notes.slice(0, limit)
  const hasMore = totalCount > limit

  return (
    <div className="flex flex-col gap-2">
      {showHeading && (
        <h2>
          <Link href="/notes" className="font-semibold">
            {notesLabel}{" "}
            <sup className="text-content-subdued">{totalCount}</sup>
          </Link>
        </h2>
      )}
      <ul className="grid list-disc list-outside ml-4">
        {visibleNotes.map((page) => (
          <li key={page.url} className="">
            <Link
              href={`/notes/${page.slug}`}
              className="inline-flex text-content-ink py-0.5 font-semibold"
            >
              {page.title}
            </Link>
          </li>
        ))}
        {hasMore ? (
          <li>
            <Link
              href="/notes"
              className="inline-block py-0.5 text-content-subdued hover:text-content-ink/75"
            >
              {listAllLabel}{" "}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
