import { cn } from "@slchow/ds"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { componentSource } from "@/lib/source"
import { getMDXComponents } from "@/mdx-components"

const Page = async ({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string[] }>
}) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  const page = componentSource.getPage(slug, locale)

  if (!page) {
    notFound()
  }

  const MDX = page.data.body

  return (
    <article className={cn("max-w-2xl mx-auto grid gap-15")}>
      <div className="">
        <h1 className={cn("")}>{page.data.title}</h1>
        {page.data.description && <p className="">{page.data.description}</p>}
      </div>
      <div className="grid gap-5">
        <MDX components={getMDXComponents()} />
      </div>
    </article>
  )
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    componentSource.getPages(locale).map((page) => ({
      locale,
      slug: page.slugs,
    }))
  )
}

export default Page
