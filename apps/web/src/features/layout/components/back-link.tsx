import { Link } from "@/i18n/navigation"
import { CornerDownLeftIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { ComponentProps } from "react"

type Props = {
  href: ComponentProps<typeof Link>["href"]
}

export const BackLink = async ({ href }: Props) => {
  const t = await getTranslations("navigation")

  return (
    <Link href={href} className="group hover:text-content-ink">
      <CornerDownLeftIcon size={10} className="inline-block mr-1.5 group-hover:-translate-x-0.5" />
      {t("back")}
    </Link>
  )
}
