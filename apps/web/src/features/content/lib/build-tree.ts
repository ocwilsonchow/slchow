import type { TreeNode } from "@/features/content/components/file-tree"
import type { componentSource } from "@/lib/source"

type FolderNode = Extract<TreeNode, { type: "folder" }>

const titleCase = (segment: string) =>
  segment
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const sortTree = (nodes: TreeNode[]): TreeNode[] => {
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "file" ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })

  for (const node of sorted) {
    if (node.type === "folder") {
      node.children = sortTree(node.children)
    }
  }

  return sorted
}

export const buildTree = (
  pages: ReturnType<typeof componentSource.getPages>
): TreeNode[] => {
  const root: TreeNode[] = []

  for (const page of pages) {
    const folders = page.slugs.slice(0, -1)

    let children = root

    for (const segment of folders) {
      let folder = children.find(
        (node): node is FolderNode =>
          node.type === "folder" && node.name === titleCase(segment)
      )

      if (!folder) {
        folder = { type: "folder", name: titleCase(segment), children: [] }
        children.push(folder)
      }

      children = folder.children
    }

    children.push({
      type: "file",
      name: page.data.title ?? page.slugs.at(-1) ?? page.url,
      href: `/components/${page.slugs.join("/")}`,
    })
  }

  return sortTree(root)
}
