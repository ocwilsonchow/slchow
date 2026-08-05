import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getCategoryPages } from "@/lib/source"

type ListNotesProps = {
  locale: string
  limit?: number
  showHeading?: boolean
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

export const ListNotes = async ({
  locale,
  limit = 5,
  showHeading = true,
}: ListNotesProps) => {
  const t = await getTranslations("navigation")
  const allNotes = getCategoryPages("notes", locale).sort(
    (a, b) => getPageDate(b.data.date) - getPageDate(a.data.date)
  )
  const hasMore = allNotes.length > limit
  const notes = allNotes.slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      {showHeading && (
        <h2>
          <Link href="/notes" className="font-semibold">
            {t("notes")}{" "}
            <sup className="text-content-subdued">{allNotes.length}</sup>
          </Link>
        </h2>
      )}
      <ul className="grid list-disc list-outside ml-4">
        {notes.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <li key={page.url} className="">
              <Link
                href={`/notes/${slug}`}
                className="inline-flex text-content-ink py-px font-semibold"
              >
                {page.data.title}
              </Link>
            </li>
          )
        })}
        {hasMore ? (
          <li>
            <Link
              href="/notes"
              className="inline-block py-px text-content-subdued hover:text-content-ink/75"
            >
              {t("listAll")}{" "}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
