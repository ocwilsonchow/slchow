import { ArrowBigLeft, CornerDownLeftIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { ComponentProps } from "react"
import { Link } from "@/i18n/navigation"

type Props = {
  href: ComponentProps<typeof Link>["href"]
}

export const BackLink = async ({ href }: Props) => {
  const t = await getTranslations("navigation")

  return (
    <div className="space-y-0.5">
      <Link href={href} className="block group hover:text-content-ink">
        <CornerDownLeftIcon
          size={10}
          className="inline-block mr-1.5 group-hover:-translate-x-0.5"
        />
        {t("back")}
      </Link>
      <div className="hidden md:inline-flex items-center gap-1 text-xs text-content-subdued">
        <kbd className="bg-surface-alpha rounded-md px-1 py-px">⌘</kbd>+
        <kbd className="bg-surface-alpha rounded-md px-1 py-px h-4.5 flex items-center justify-center">
          <ArrowBigLeft size={10} aria-hidden />
        </kbd>
      </div>
    </div>
  )
}
