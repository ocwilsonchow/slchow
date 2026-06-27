"use client"

import { cn, isActivePath } from "@slchow/ds"
import { ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { Link, usePathname } from "@/i18n/navigation"

export type TreeNode =
  | { type: "file"; name: string; href: string }
  | { type: "folder"; name: string; children: TreeNode[] }

const INDENT = 23

export const FileTree = ({ tree }: { tree: TreeNode[] }) => {
  return (
    <ul className="grid gap-px uppercase">
      {tree.map((node) => (
        <FileTreeNode key={nodeKey(node)} node={node} depth={0} />
      ))}
    </ul>
  )
}

const FileTreeNode = ({ node, depth }: { node: TreeNode; depth: number }) => {
  const pathname = usePathname()
  const paddingLeft = depth * INDENT + 12

  if (node.type === "file") {
    const isActive = isActivePath(pathname, node.href)

    return (
      <li>
        <Link
          href={node.href}
          aria-current={isActive ? "page" : undefined}
          style={{ paddingLeft }}
          className={cn(
            "flex items-center gap-2 py-1 pr-3 text-content-ink hover:bg-surface-hover hover:text-brand-content-primary focus-visible:bg-surface-hover focus-visible:text-brand-content-primary focus-visible:outline-none",
            isActive &&
              "bg-brand-surface-alpha text-brand-content-primary hover:text-brand-content-primary"
          )}
        >
          {/* <FileIcon size={15} strokeWidth={1.25} className="shrink-0 opacity-75" /> */}
          <span className="truncate">{node.name}</span>
        </Link>
      </li>
    )
  }

  return <FileTreeFolder node={node} depth={depth} paddingLeft={paddingLeft} />
}

const FileTreeFolder = ({
  node,
  depth,
  paddingLeft,
}: {
  node: Extract<TreeNode, { type: "folder" }>
  depth: number
  paddingLeft: number
}) => {
  const [open, setOpen] = useState(true)

  return (
    <li className="grid gap-px">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        style={{ paddingLeft }}
        className="uppercase flex w-full items-center gap-2 py-1 pr-3 text-content-ink hover:bg-surface-hover hover:text-brand-content-primary focus-visible:bg-surface-hover focus-visible:text-brand-content-primary focus-visible:outline-none"
      >
        <ChevronRightIcon
          size={15}
          strokeWidth={1.25}
          className={cn(
            "shrink-0 opacity-75 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
        {/* <FolderIcon size={15} strokeWidth={1.25} className="shrink-0 opacity-75" /> */}
        <span className="truncate">{node.name}</span>
      </button>
      {open ? (
        <ul className="grid gap-px">
          {node.children.map((child) => (
            <FileTreeNode key={nodeKey(child)} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

const nodeKey = (node: TreeNode) =>
  node.type === "file" ? `file:${node.href}` : `folder:${node.name}`
