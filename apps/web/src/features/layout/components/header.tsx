import { cn } from "@repo/ds"
import { getLocale, getTranslations } from "next-intl/server"
import type { ComponentProps } from "react"
import { getDesigns } from "@/features/design/get-designs"
import { Link } from "@/i18n/navigation"
import { getCategoryPages } from "@/lib/source"
import { HeaderSearchTrigger } from "./header-search-trigger"

export const Root = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "lg:grid lg:grid-cols-2 sm:space-y-4 lg:sticky lg:top-0 p-5",
        props.className
      )}
    />
  )
}

export const Info = async ({ ...props }: ComponentProps<"div">) => {
  const t = await getTranslations("navigation")

  return (
    <div
      {...props}
      className={cn(
        "text-content-ink font-semibold space-y-5 flex flex-row items-center justify-between md:items-start md:justify-start md:flex-col",
        props.className
      )}
    >
      <div>
        <h1>
          <Link href="/">Wilson Chow</Link>
        </h1>
        <h2 className="text-content-subdued font-medium text-sm">{t("role")}</h2>
      </div>
      <HeaderSearchTrigger />
    </div>
  )
}

const HeaderLink = ({ className, ...props }: ComponentProps<typeof Link>) => {
  return (
    <li>
      <Link
        {...props}
        className={cn("transition-colors hover:text-content-ink", className)}
      />
    </li>
  )
}

export const Links = async ({ className, ...props }: ComponentProps<"div">) => {
  const t = await getTranslations("navigation")
  const locale = await getLocale()
  const notesCount = getCategoryPages("notes", locale).length
  const designsCount = getDesigns().reduce(
    (total, design) => total + design.images.length,
    0
  )

  return (
    <div {...props} className={cn("hidden md:flex flex-col gap-5", className)}>
      <ul className="flex flex-col gap-px">
        <HeaderLink href="/resume">{t("resume")}</HeaderLink>
        <HeaderLink href="/notes">
          {t("notes")} <sup className="text-content-subdued">{notesCount}</sup>
        </HeaderLink>
        <HeaderLink href="/design">
          {t("designs")}{" "}
          <sup className="text-content-subdued">{designsCount}</sup>
        </HeaderLink>
      </ul>
      <ul className="flex flex-col gap-px">
        <HeaderLink
          href="https://github.com/ocwilsonchow"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </HeaderLink>
        <HeaderLink
          href="https://www.linkedin.com/in/wilsonslchow/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </HeaderLink>
        <HeaderLink
          href="https://www.instagram.com/duoengineers/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </HeaderLink>
      </ul>
    </div>
  )
}

export const Column = ({ ...props }: ComponentProps<"div">) => {
  return <div {...props} className={cn("", props.className)} />
}

export const Header = {
  Root,
  Info,
  Links,
  Column,
}
