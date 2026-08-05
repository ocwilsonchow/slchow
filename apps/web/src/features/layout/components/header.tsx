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
    <div
      {...props}
      className={cn("text-content-ink font-semibold", props.className)}
    >
      <Link href="/">Wilson Chow</Link>
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

export const Links = async ({ ...props }: ComponentProps<"ul">) => {
  const t = await getTranslations("navigation")

  return (
    <ul
      {...props}
      className={cn("hidden md:flex flex-col gap-px", props.className)}
    >
      <HeaderLink href="/resume">{t("resume")}</HeaderLink>
      <HeaderLink href="/writings">{t("writings")}</HeaderLink>
      <HeaderLink href="/works">{t("works")}</HeaderLink>
      <HeaderLink href="/">
        {t("designs")} ({t("comingSoon")})
      </HeaderLink>
      <div className="my-3" />
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
