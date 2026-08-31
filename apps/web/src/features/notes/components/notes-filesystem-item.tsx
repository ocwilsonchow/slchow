"use client"

import { cn } from "@repo/ds"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useNotesFileTree } from "../hooks/use-notes-file-tree"
import type { NotesTreeNode } from "./build-notes-tree"

const rowClassName =
  "flex w-full items-center gap-1.5 py-0.75 px-1.5 font-semibold text-content-ink rounded-md text-left hover:bg-surface-alpha outline-none focus-visible:ring-[3px] focus-visible:ring-content-ink"

export function ListNotesTree({ nodes }: { nodes: NotesTreeNode[] }) {
  return (
    <ul className="leading-tight">
      {nodes.map((node) => (
        <NotesFilesystemItem
          key={node.slug ?? node.category ?? node.name}
          node={node}
        />
      ))}
    </ul>
  )
}

function NotesFilesystemItem({ node }: { node: NotesTreeNode }) {
  if (node.nodes === undefined) {
    return <NoteFileItem node={node} />
  }

  return <NoteFolderItem node={node} />
}

function NoteFileItem({ node }: { node: NotesTreeNode }) {
  return (
    <li>
      <Link href={`/notes/${node.slug}`} className={rowClassName}>
        <span className="size-4 shrink-0" aria-hidden />
        <span>{node.name}</span>
      </Link>
    </li>
  )
}

function NoteFolderItem({ node }: { node: NotesTreeNode }) {
  const t = useTranslations("notes")
  const folderId = node.category ?? node.name
  const isOpen = useNotesFileTree((s) => s.isFolderOpen(folderId))
  const toggleFolder = useNotesFileTree((s) => s.toggleFolder)
  const children = node.nodes ?? []
  const hasChildren = children.length > 0
  const label = node.category ? t(`categories.${node.category}`) : node.name

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => toggleFolder(folderId)}
        className={rowClassName}
      >
        {hasChildren ? (
          <ChevronRight
            aria-hidden
            className={cn(
              "size-4 shrink-0 text-content-subdued transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        <Image
          src="/Folder.png"
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0 object-contain"
          aria-hidden
        />
        <span>{label}</span>
        <sup className="text-content-subdued">{children.length}</sup>
      </button>
      {isOpen && hasChildren ? (
        <ul className="pl-6">
          {children.map((child) => (
            <NotesFilesystemItem
              key={child.slug ?? child.category ?? child.name}
              node={child}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
