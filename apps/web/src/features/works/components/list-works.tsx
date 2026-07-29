import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getCategoryPages } from "@/lib/source"
import { AsteriskIcon } from "lucide-react"

type ListWorksProps = {
  locale: string
  limit?: number
  showHeading?: boolean
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

export const ListWorks = async ({
  locale,
  limit = 5,
  showHeading = true,
}: ListWorksProps) => {
  const t = await getTranslations("navigation")
  const allWorks = getCategoryPages("works", locale).sort(
    (a, b) => getPageDate(b.data.date) - getPageDate(a.data.date)
  )
  const hasMore = allWorks.length > limit
  const works = allWorks.slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      {showHeading && (
        <h2>
          <Link href="/works" className="font-semibold">
            {t("works")}{" "}
            <sup className="text-content-subdued">{allWorks.length}</sup>
          </Link>
        </h2>
      )}
      <ul className="flex flex-col list-disc list-inside">
        {works.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <li key={page.url}>
              <Link
                href={`/works/${slug}`}
                className="inline-block py-px text-content-ink"
              >
                <span className="font-semibold">{page.data.title}</span>{" "}
                {page.data.description && (
                  <span className="text-content-subdued">
                    - {page.data.description}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
        {hasMore ? (
          <li>
            <Link
              href="/works"
              className="inline-block py-px text-content-subdued hover:text-content-ink/75"
            >
              {t("listAll")}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
