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
  const writings = getCategoryPages("writings", locale)
    .sort((a, b) => getPageDate(b.data.date) - getPageDate(a.data.date))
    .slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      <h2>
        <Link href="/writings">{t("writings")}</Link>
      </h2>
      <ul className="grid list-disc list-inside">
        {writings.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <li key={page.url} className="">
              <Link href={`/writings/${slug}`} className="inline-block py-0.5">
                {page.data.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
