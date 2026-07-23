"use client"

import { Link } from "@/i18n/navigation"
import { cn } from "@repo/ds"
import { Portal } from "@repo/ds/components/ui/portal"
import { HTMLMotionProps, motion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { create } from "zustand"

export type NavbarState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useNavbar = create<NavbarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}))

const Root = (props: HTMLMotionProps<"nav">) => {
  return (
    <motion.nav {...props} className={cn("fixed top-0 left-0 right-0 z-50")} />
  )
}

const Header = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      {...props}
      className={cn("flex items-start px-5 py-5 md:py-4")}
    ></motion.div>
  )
}

const Trigger = (props: HTMLMotionProps<"button">) => {
  const { isOpen, setIsOpen } = useNavbar()
  const t = useTranslations("navigation")

  return (
    <motion.button
      className={cn("")}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {isOpen ? t("shut") : t("menu")}
    </motion.button>
  )
}

const Content = (props: HTMLMotionProps<"div">) => {
  const { isOpen } = useNavbar()
  return (
    <Portal className="fixed inset-0 z-49 grid">
      <motion.div
        {...props}
        variants={{
          close: {
            height: 0,
            transition: {
              delay: 0.2,
            },
          },
          open: {
            height: "100%",
          },
        }}
        initial="close"
        animate={isOpen ? "open" : "close"}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
        className="overflow-hidden bg-surface-canvas text-content-ink-inverse"
      ></motion.div>
    </Portal>
  )
}

const formatLocaleTime = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Hong_Kong",
  })
    .format(date)
    .replace(/\s/g, "")
}

export const Time = () => {
  const locale = useLocale()
  const [time, setTime] = useState({ display: "", dateTime: "" })

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime({
        display: formatLocaleTime(now, locale),
        dateTime: now.toISOString(),
      })
    }

    update()

    const now = new Date()
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    let intervalId: number

    const timeoutId = window.setTimeout(() => {
      update()
      intervalId = window.setInterval(update, 60_000)
    }, msUntilNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [locale])

  return (
    <time dateTime={time.dateTime} suppressHydrationWarning aria-live="polite">
      {time.display}
    </time>
  )
}

const Location = () => {
  const t = useTranslations("navigation")

  return <div>{t("location")}</div>
}

export const Navbar = {
  Root,
  Header,
  Trigger,
  Content,
  Time,
  Location,
}

export const RenderNavbar = () => {
  const t = useTranslations("navigation")

  return (
    <Navbar.Root>
      <Navbar.Header>
        <div className="flex-1">
          <span>Wilson. </span>
        </div>
        <div className="flex-1 lg:flex hidden items-center justify-start gap-4">
          <div>
            <Link href="/">{t("home")}</Link>
          </div>
          <div>
            <Link href="/about">{t("about")}</Link>
          </div>
          <div>
            <Link href="/work">{t("work")}</Link>
          </div>
        </div>
        <div className="flex-1 lg:flex justify-end hidden">{t("settings")}</div>
        <div className="flex-1 lg:flex justify-end hidden gap-3">
          <Navbar.Time />
          <Navbar.Location />
        </div>
        <div className="flex-1 flex justify-end lg:hidden">
          <Navbar.Trigger />
        </div>
      </Navbar.Header>
      <Navbar.Content></Navbar.Content>
    </Navbar.Root>
  )
}
