import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type { PropsWithChildren } from "react"
import { FileTree } from "@/features/content/components/file-tree"
import { buildTree } from "@/features/content/lib/build-tree"
import { componentSource } from "@/lib/source"

export default async function Layout({
  params,
  children,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params

  setRequestLocale(locale as Locale)

  const pages = componentSource.getPages(locale)
  const tree = buildTree(pages)

  return (
    <div className="flex items-start gap-4">
      <div className="w-64">
        <FileTree tree={tree} />
      </div>
      <div className="flex-1 shrink-0">{children}</div>
    </div>
  )
}
