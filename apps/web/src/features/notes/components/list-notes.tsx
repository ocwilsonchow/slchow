import { getTranslations } from "next-intl/server"
import { getSortedNotes } from "@/lib/source"
import { buildNotesTree } from "./build-notes-tree"
import { ListNotesItems } from "./list-notes-items"
import { ListNotesTree } from "./notes-filesystem-item"

type ListNotesProps = {
  locale: string
  preview?: boolean
  showHeading?: boolean
  variant?: "list" | "tree"
}

export const ListNotes = async ({
  locale,
  preview = false,
  showHeading = true,
  variant = "list",
}: ListNotesProps) => {
  const allNotes = getSortedNotes(locale)
  const notes = allNotes.map((page) => ({
    url: page.url,
    slug: page.slugs.slice(1).join("/"),
    title: page.data.title ?? "",
    category: page.data.category,
  }))

  if (variant === "tree") {
    return <ListNotesTree nodes={buildNotesTree(notes)} />
  }

  const t = await getTranslations("navigation")

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
