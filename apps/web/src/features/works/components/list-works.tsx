import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getCategoryPages } from "@/lib/source"

type ListWorksProps = {
  locale: string
  limit?: number
}

const getPageDate = (date?: string | Date) => {
  if (!date) return 0
  return new Date(date).getTime()
}

export const ListWorks = async ({ locale, limit = 5 }: ListWorksProps) => {
  const t = await getTranslations("navigation")
  const works = getCategoryPages("works", locale)
    .sort((a, b) => getPageDate(b.data.date) - getPageDate(a.data.date))
    .slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      <h2>{t("works")}</h2>
      <ul className="flex flex-col list-disc list-inside">
        {works.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <li key={page.url}>
              <Link href={`/works/${slug}`}>{page.data.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
