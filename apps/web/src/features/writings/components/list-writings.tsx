import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getCategoryPages } from "@/lib/source"

type ListWritingsProps = {
  locale: string
  limit?: number
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

export const ListWritings = async ({
  locale,
  limit = 5,
}: ListWritingsProps) => {
  const t = await getTranslations("navigation")
  const allWritings = getCategoryPages("writings", locale).sort(
    (a, b) => getPageDate(b.data.date) - getPageDate(a.data.date)
  )
  const hasMore = allWritings.length > limit
  const writings = allWritings.slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      <h2>
        <Link href="/writings">
          {t("writings")}{" "}
          <sup className="text-content-subdued">{allWritings.length}</sup>
        </Link>
      </h2>
      <ul className="grid list-disc list-inside">
        {writings.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <li key={page.url} className="">
              <Link
                href={`/writings/${slug}`}
                className="inline-block text-content-ink py-px"
              >
                {page.data.title}
              </Link>
            </li>
          )
        })}
        {hasMore ? (
          <li>
            <Link
              href="/writings"
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
