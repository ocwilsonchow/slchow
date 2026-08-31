import { describe, expect, it } from "vitest"
import { buildNotesTree } from "./build-notes-tree"
import type { ListNoteItem } from "./list-notes-items"

const note = (
  overrides: Pick<ListNoteItem, "slug" | "title" | "category">
): ListNoteItem => ({
  url: `/notes/${overrides.slug}`,
  ...overrides,
})

describe("buildNotesTree", () => {
  it("groups notes into category folders in NOTES_CATEGORY_ORDER", () => {
    const tree = buildNotesTree([
      note({ slug: "ts-one", title: "TS One", category: "typescript" }),
      note({ slug: "fe-one", title: "FE One", category: "frontend" }),
      note({ slug: "ts-two", title: "TS Two", category: "typescript" }),
    ])

    expect(tree.map((node) => node.category)).toEqual([
      "frontend",
      "typescript",
    ])
    expect(tree[0]?.nodes?.map((child) => child.slug)).toEqual(["fe-one"])
    expect(tree[1]?.nodes?.map((child) => child.slug)).toEqual([
      "ts-one",
      "ts-two",
    ])
  })

  it("preserves pin-then-date order inside each folder", () => {
    const tree = buildNotesTree([
      note({ slug: "pinned-fe", title: "Pinned FE", category: "frontend" }),
      note({ slug: "older-fe", title: "Older FE", category: "frontend" }),
    ])

    expect(tree[0]?.nodes?.map((child) => child.slug)).toEqual([
      "pinned-fe",
      "older-fe",
    ])
  })

  it("renders uncategorized notes as root-level files after folders", () => {
    const tree = buildNotesTree([
      note({ slug: "fe-one", title: "FE One", category: "frontend" }),
      note({ slug: "loose", title: "Loose note" }),
    ])

    expect(tree).toEqual([
      {
        name: "frontend",
        category: "frontend",
        nodes: [{ name: "FE One", slug: "fe-one" }],
      },
      { name: "Loose note", slug: "loose" },
    ])
  })

  it("omits empty categories", () => {
    const tree = buildNotesTree([
      note({ slug: "ai-one", title: "AI One", category: "ai" }),
    ])

    expect(tree).toHaveLength(1)
    expect(tree[0]?.category).toBe("ai")
  })
})
