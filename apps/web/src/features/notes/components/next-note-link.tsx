import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getNextNote } from "@/lib/source"
import { ArrowRight, ArrowUpRight } from "lucide-react"

type NextNoteLinkProps = {
  slug: string
  locale: string
}

export async function NextNoteLink({ slug, locale }: NextNoteLinkProps) {
  const next = getNextNote(slug, locale)
  if (!next) return null

  const t = await getTranslations("notes")

  return (
    <div className="mt-20 max-w-prose w-full flex flex-col pb-20 border-t pt-5">
      <div className="text-content-subdued text-xs">Next Note</div>
      <Link
        href={`/notes/${next.slug}`}
        className="font-semibold text-content-ink py-2 w-full"
      >
        {next.title} <ArrowRight className="w-4 h-4 inline-block" />
      </Link>
    </div>
  )
}
