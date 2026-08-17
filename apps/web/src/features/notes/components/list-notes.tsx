import { getTranslations } from "next-intl/server"
import { getCategoryPages } from "@/lib/source"
import { type ListNoteCategory, ListNotesItems } from "./list-notes-items"

type ListNotesProps = {
  locale: string
  preview?: boolean
  showHeading?: boolean
}

const CATEGORY_ORDER: ListNoteCategory[] = [
  "frontend",
  "backend",
  "ai",
  "security",
  "devops",
  "computer-science",
  "full-stack",
  "personal",
]

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

const getCategoryIndex = (category?: ListNoteCategory) => {
  if (!category) return CATEGORY_ORDER.length
  const index = CATEGORY_ORDER.indexOf(category)
  return index === -1 ? CATEGORY_ORDER.length : index
}

export const ListNotes = async ({
  locale,
  preview = false,
  showHeading = true,
}: ListNotesProps) => {
  const t = await getTranslations("navigation")
  const allNotes = getCategoryPages("notes", locale).sort((a, b) => {
    const categoryDiff =
      getCategoryIndex(a.data.category) - getCategoryIndex(b.data.category)
    if (categoryDiff !== 0) return categoryDiff
    return getPageDate(b.data.date) - getPageDate(a.data.date)
  })
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
