import { getTranslations } from "next-intl/server"
import { getCategoryPages } from "@/lib/source"
import { ListNotesItems } from "./list-notes-items"

type ListNotesProps = {
  locale: string
  limit?: number
  showHeading?: boolean
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

const RESPONSIVE_MAX_LIMIT = 5

export const ListNotes = async ({
  locale,
  limit,
  showHeading = true,
}: ListNotesProps) => {
  const t = await getTranslations("navigation")
  const allNotes = getCategoryPages("notes", locale).sort(
    (a, b) => getPageDate(b.data.date) - getPageDate(a.data.date)
  )
  const fetchLimit = limit ?? RESPONSIVE_MAX_LIMIT
  const notes = allNotes.slice(0, fetchLimit).map((page) => ({
    url: page.url,
    slug: page.slugs.slice(1).join("/"),
    title: page.data.title ?? "",
  }))

  // Infinity is not safe across the RSC → client boundary; use notes.length instead.
  const clientLimit =
    limit === undefined
      ? undefined
      : Number.isFinite(limit)
        ? limit
        : notes.length

  return (
    <ListNotesItems
      notes={notes}
      totalCount={allNotes.length}
      limit={clientLimit}
      showHeading={showHeading}
      notesLabel={t("notes")}
      listAllLabel={t("listAll")}
    />
  )
}
