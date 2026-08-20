import { notFound } from "next/navigation"
import { hasLocale, type Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { BackLink } from "@/features/layout/components/back-link"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { Toc } from "@/features/mdx/components/toc"
import { isResumeVariant, resumeVariants } from "@/features/resume/variants"
import { routing } from "@/i18n/routing"
import { getMdxContent, loadMdxCompiled } from "@/lib/source"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string; variant: string }>
}

export default async function ResumeLayout({ children, params }: Props) {
  const { locale, variant } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale as Locale)

  if (!isResumeVariant(variant)) notFound()

  const slug = resumeVariants[variant]
  const page = getMdxContent("blocks", slug, locale)
  if (!page) notFound()

  const toc = (await loadMdxCompiled(page)).toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start content-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-1 space-y-1">
          <h1 className="font-semibold tracking-tight text-content-ink">
            {page.data.title ?? "Resume"}
          </h1>
          <Toc toc={toc} className="hidden lg:block" />
        </Header.Column>
      </Header.Root>
      <article className="grid">{children}</article>
    </PageLayout>
  )
}
