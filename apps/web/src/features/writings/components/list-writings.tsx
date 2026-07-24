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

export const ListWritings = async ({ locale, limit = 5 }: ListWritingsProps) => {
  const t = await getTranslations("navigation")
  const writings = getCategoryPages("writings", locale)
    .sort((a, b) => getPageDate(b.data.date) - getPageDate(a.data.date))
    .slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      <h2>{t("writings")}</h2>
      <ul className="flex flex-col list-disc list-inside">
        {writings.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <li key={page.url}>
              <Link href={`/writings/${slug}`}>{page.data.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
