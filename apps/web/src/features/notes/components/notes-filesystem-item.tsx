"use client"

import { cn } from "@repo/ds"
import { ChevronRight } from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { Link } from "@/i18n/navigation"
import { useNotesFileTree } from "../hooks/use-notes-file-tree"
import type { NotesTreeNode } from "./build-notes-tree"

const rowClassName =
  "flex w-full items-center gap-1.5 py-0.75 px-1.5 font-semibold text-content-ink rounded-md text-left hover:bg-surface-alpha outline-none focus-visible:ring-[3px] focus-visible:ring-content-ink"

const folderEase = [0.4, 0, 0.2, 1] as const
const STAGGER = 0.02

const folderListVariants: Variants = {
  open: {
    height: "auto",
    transition: {
      height: { duration: 0.2, ease: folderEase },
      staggerChildren: STAGGER,
    },
  },
  closed: {
    height: 0,
    transition: {
      height: { duration: 0.2, ease: folderEase },
      staggerChildren: STAGGER,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
}

const folderItemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: folderEase },
  },
  closed: {
    opacity: 0,
    y: -0,
    transition: { duration: 0.1, ease: folderEase },
  },
}

const reducedFolderListVariants: Variants = {
  open: { height: "auto", transition: { duration: 0 } },
  closed: { height: 0, transition: { duration: 0 } },
}

const reducedFolderItemVariants: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0 } },
  closed: { opacity: 1, y: 0, transition: { duration: 0 } },
}

type TreeItemProps = {
  node: NotesTreeNode
  shouldReduceMotion: boolean
  staggered?: boolean
}

export function ListNotesTree({ nodes }: { nodes: NotesTreeNode[] }) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <LayoutGroup id="notes-file-tree">
      <ul className="leading-tight">
        {nodes.map((node) => (
          <NotesFilesystemItem
            key={node.slug ?? node.category ?? node.name}
            node={node}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </ul>
    </LayoutGroup>
  )
}

function NotesFilesystemItem({
  node,
  shouldReduceMotion,
  staggered = false,
}: TreeItemProps) {
  if (node.nodes === undefined) {
    return (
      <NoteFileItem
        node={node}
        shouldReduceMotion={shouldReduceMotion}
        staggered={staggered}
      />
    )
  }

  return (
    <NoteFolderItem
      node={node}
      shouldReduceMotion={shouldReduceMotion}
      staggered={staggered}
    />
  )
}

function NoteFileItem({
  node,
  shouldReduceMotion,
  staggered = false,
}: TreeItemProps) {
  const itemVariants = shouldReduceMotion
    ? reducedFolderItemVariants
    : folderItemVariants

  return (
    <motion.li
      layout={staggered ? false : "position"}
      variants={staggered ? itemVariants : undefined}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: folderEase,
      }}
    >
      <Link href={`/notes/${node.slug}`} className={rowClassName}>
        <span className="size-4 shrink-0" aria-hidden />
        <span>{node.name}</span>
      </Link>
    </motion.li>
  )
}

function NoteFolderItem({
  node,
  shouldReduceMotion,
  staggered = false,
}: TreeItemProps) {
  const t = useTranslations("notes")
  const folderId = node.category ?? node.name
  const isOpen = useNotesFileTree((s) => s.isFolderOpen(folderId))
  const toggleFolder = useNotesFileTree((s) => s.toggleFolder)
  const children = node.nodes ?? []
  const hasChildren = children.length > 0
  const label = node.category ? t(`categories.${node.category}`) : node.name
  const skipInitialEnter = useRef(isOpen)
  const listVariants = shouldReduceMotion
    ? reducedFolderListVariants
    : folderListVariants
  const itemVariants = shouldReduceMotion
    ? reducedFolderItemVariants
    : folderItemVariants
  const transition = {
    duration: shouldReduceMotion ? 0 : 0.2,
    ease: folderEase,
  }

  useEffect(() => {
    skipInitialEnter.current = false
  }, [])

  return (
    <motion.li
      layout={staggered ? false : "position"}
      variants={staggered ? itemVariants : undefined}
      transition={transition}
    >
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
              "size-4 shrink-0 text-content-subdued transition-transform duration-200 motion-reduce:transition-none",
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
      <AnimatePresence>
        {isOpen && hasChildren ? (
          <motion.ul
            key={`${folderId}-children`}
            variants={listVariants}
            initial={skipInitialEnter.current ? false : "closed"}
            animate="open"
            exit="closed"
            className="overflow-hidden pl-6"
          >
            {children.map((child) => (
              <NotesFilesystemItem
                key={child.slug ?? child.category ?? child.name}
                node={child}
                shouldReduceMotion={shouldReduceMotion}
                staggered
              />
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </motion.li>
  )
}
