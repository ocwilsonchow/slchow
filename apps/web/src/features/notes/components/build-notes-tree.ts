import { NOTES_CATEGORY_ORDER } from "@/lib/notes-category-order"
import type { ListNoteCategory, ListNoteItem } from "./list-notes-items"

export type NotesTreeNode = {
  name: string
  slug?: string
  category?: ListNoteCategory
  nodes?: NotesTreeNode[]
}

export function buildNotesTree(notes: ListNoteItem[]): NotesTreeNode[] {
  const folders = new Map<ListNoteCategory, NotesTreeNode[]>()
  const uncategorized: NotesTreeNode[] = []

  for (const note of notes) {
    const file: NotesTreeNode = {
      name: note.title,
      slug: note.slug,
    }

    if (!note.category) {
      uncategorized.push(file)
      continue
    }

    const children = folders.get(note.category)
    if (children) {
      children.push(file)
    } else {
      folders.set(note.category, [file])
    }
  }

  const root: NotesTreeNode[] = []

  for (const category of NOTES_CATEGORY_ORDER) {
    const children = folders.get(category)
    if (!children?.length) continue

    root.push({
      name: category,
      category,
      nodes: children,
    })
    folders.delete(category)
  }

  for (const [category, children] of folders) {
    root.push({
      name: category,
      category,
      nodes: children,
    })
  }

  root.push(...uncategorized)
  return root
}
