import { Link } from "@/i18n/navigation"
import { cn } from "@repo/ds"
import { getTranslations } from "next-intl/server"
import type { ComponentProps } from "react"

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

export const Info = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("text-content-ink font-semibold", props.className)}>
      <Link href="/">Wilson Chow</Link>
    </div>
  )
}

export const Links = async ({ ...props }: ComponentProps<"div">) => {
  const t = await getTranslations("navigation")

  return (
    <div {...props} className={cn("hidden md:block", props.className)}>
      <div>
        <Link href="/resume">{t("resume")}</Link>
      </div>
      <div>
        <Link href="/works">{t("works")}</Link>
      </div>
      <div>
        <Link href="/writings">{t("writings")}</Link>
      </div>
      <div>
        <Link
          href="https://github.com/ocwilsonchow"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </div>
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
