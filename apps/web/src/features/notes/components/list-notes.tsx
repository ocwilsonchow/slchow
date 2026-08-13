import { getTranslations } from "next-intl/server"
import { getCategoryPages } from "@/lib/source"
import { ListNotesItems } from "./list-notes-items"

type ListNotesProps = {
  locale: string
  preview?: boolean
  showHeading?: boolean
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

export const ListNotes = async ({
  locale,
  preview = false,
  showHeading = true,
}: ListNotesProps) => {
  const t = await getTranslations("navigation")
  const tNotes = await getTranslations("notes")
  const allNotes = getCategoryPages("notes", locale).sort(
    (a, b) => getPageDate(b.data.date) - getPageDate(a.data.date)
  )
  const notes = allNotes.map((page) => ({
    url: page.url,
    slug: page.slugs.slice(1).join("/"),
    title: page.data.title ?? "",
    category: page.data.category
      ? tNotes(`categories.${page.data.category}`)
      : undefined,
  }))

  return (
    <ListNotesItems
      notes={notes}
      totalCount={allNotes.length}
      preview={preview}
      showHeading={showHeading}
      notesLabel={t("notes")}
      listAllLabel={t("listAll")}
    />
  )
}
