import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { NotFoundView } from "@/features/layout/components/not-found-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound")
  return { title: t("title") }
}

export default async function NotFoundPage() {
  const t = await getTranslations("notFound")

  return <NotFoundView title={t("title")} description={t("description")} />
}
