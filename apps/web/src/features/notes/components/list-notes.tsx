import { getTranslations } from "next-intl/server"
import { getSortedNotes } from "@/lib/source"
import { ListNotesItems } from "./list-notes-items"

type ListNotesProps = {
  locale: string
  preview?: boolean
  showHeading?: boolean
}

export const ListNotes = async ({
  locale,
  preview = false,
  showHeading = true,
}: ListNotesProps) => {
  const t = await getTranslations("navigation")
  const allNotes = getSortedNotes(locale)
  const notes = allNotes.map((page) => ({
    url: page.url,
    slug: page.slugs.slice(1).join("/"),
    title: page.data.title ?? "",
    category: page.data.category,
  }))

  return (
    <ListNotesItems
      notes={notes}
      totalCount={allNotes.length}
      preview={preview}
      showHeading={showHeading}
      notesLabel={t("notes")}
    />
  )
}
