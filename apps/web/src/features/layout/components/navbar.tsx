"use client"

import { create } from "zustand"
import { ComponentProps, Fragment, useEffect, useState } from "react"
import { type HTMLMotionProps, motion, Variants } from "motion/react"
import { Portal as ReactPortal } from "@repo/ds/components/ui/portal"
import { cn, useTheme } from "@repo/ds"
import { useClickAway } from "@uidotdev/usehooks"
import { fontPresets } from "./styles"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useLenis } from "lenis/react"
import { Locale, useLocale, useTranslations } from "next-intl"
import { localeOptions } from "@/i18n/routing"

export type NavbarState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useNavbar = create<NavbarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}))

const Root = (props: HTMLMotionProps<"div">) => {
  return <motion.div {...props}></motion.div>
}

const Header = ({ className, ...props }: HTMLMotionProps<"div">) => {
  const { isOpen, setIsOpen } = useNavbar()
  const lenis = useLenis()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() !== "k") return
      if (!(event.metaKey || event.ctrlKey)) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      event.preventDefault()
      setIsOpen(true)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [setIsOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    lenis?.stop()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      lenis?.start()
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, lenis, setIsOpen])
  return (
    <motion.div
      {...props}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 lg:grid-cols-3 pointer-events-auto",
        isOpen ? "text-content-ink-on-accent delay-0" : "delay-500",
        className,
        fontPresets.aero
      )}
    >
      {props.children}
    </motion.div>
  )
}

const Portal = (props: ComponentProps<"div">) => {
  const { isOpen, setIsOpen } = useNavbar()
  const ref = useClickAway<HTMLDivElement>(() => {
    if (isOpen) setIsOpen(false)
  })

  return (
    <ReactPortal
      ref={ref}
      className={cn(
        "fixed inset-0 grid z-49 content-end",
        props.className,
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {props.children}
    </ReactPortal>
  )
}

const Content = (props: HTMLMotionProps<"div">) => {
  const { isOpen } = useNavbar()

  return (
    <motion.div
      {...props}
      variants={{
        close: {
          height: "0vh",
          transition: {
            delay: 0,
            when: "afterChildren",
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
        open: {
          height: "60vh",
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      transition={{
        ease: "easeInOut",
        duration: 0.2,
      }}
      initial="close"
      animate={isOpen ? "open" : "close"}
      className={cn(
        "overflow-hidden grid",
        "bg-surface-canvas text-content-ink",
        "bg-accent-surface-canvas text-content-ink-on-accent",
        fontPresets.aero
      )}
    >
      {props.children}
    </motion.div>
  )
}

const containerVariants: Variants = {
  close: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.05,
      // delayChildren: 0.05,
    },
  },
}

const listVariants: Variants = {
  close: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  close: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: {
      delay: 0.25,
      ease: "easeInOut",
      duration: 0.25,
    },
  },
}

const Trigger = (props: ComponentProps<"button">) => {
  const { isOpen, setIsOpen } = useNavbar()
  const t = useTranslations("navigation")

  return (
    <div className="w-full">
      <button
        className={cn("p-5 text-left w-full overflow-hidden")}
        {...props}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? t("close") : t("menu")}
      </button>
    </div>
  )
}

const HeaderBackdrop = (props: HTMLMotionProps<"div">) => {
  const { isOpen } = useNavbar()
  if (isOpen) return null
  return (
    <motion.div
      {...props}
      className="fixed bottom-0 inset-x-0 z-40 h-13 bg-surface-canvas pointer-events-none"
    />
  )
}

const Backdrop = (props: HTMLMotionProps<"div">) => {
  const { isOpen } = useNavbar()

  return (
    <motion.div
      {...props}
      variants={{
        close: {
          opacity: 0,
          transition: {
            duration: 0.2,
            delay: 0.5,
          },
        },
        open: {
          opacity: 1,
        },
      }}
      initial="close"
      animate={isOpen ? "open" : "close"}
      className="fixed inset-0 z-45 bg-surface-canvas/20 backdrop-blur-sm pointer-events-none"
    />
  )
}

const formatLocaleTime = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/\s/g, "")
}

const NavbarTime = () => {
  const locale = useLocale()
  const t = useTranslations("navigation")
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
    const msUntilNextSecond = 1000 - now.getMilliseconds()

    let intervalId: number

    const timeoutId = window.setTimeout(() => {
      update()
      intervalId = window.setInterval(update, 1000)
    }, msUntilNextSecond)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [locale])

  return (
    <motion.time
      dateTime={time.dateTime}
      suppressHydrationWarning
      aria-live="polite"
    >
      {time.display}, {t("location")}
    </motion.time>
  )
}

const LinkItem = (props: ComponentProps<typeof Link>) => {
  const { isOpen, setIsOpen } = useNavbar()
  return (
    <Link
      {...props}
      className={cn("block", props.className)}
      onClick={() => setIsOpen(false)}
    >
      {props.children}
    </Link>
  )
}

const themeOptions = [
  {
    id: "system",
    labelKey: "themeSystem",
    color: ["#ffffff", "#3f3d39"],
  },
  {
    id: "light",
    labelKey: "themeLight",
    color: ["#ffffff"],
  },
  {
    id: "dark",
    labelKey: "themeDark",
    color: ["#3f3d39"],
  },
] as const

const ThemeSettings = (props: HTMLMotionProps<"div">) => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("navigation")

  return (
    <motion.div className="flex flex-col justify-between space-y-1">
      <div className="">{t("theme")}</div>
      <div className="flex items-center gap-2">
        {themeOptions.map((option, index) => (
          <Fragment key={option.id}>
            <button
              onClick={() => setTheme(option.id)}
              className={cn("flex-wrap flex items-center gap-2")}
            >
              <div
                onClick={() => setTheme(option.id)}
                className={cn(
                  "aspect-square border-2 rounded-full overflow-hidden w-4 flex"
                  // theme === option.id ? "outline-blue-500" : "outline-transparent"
                )}
              >
                {option.color.map((c) => (
                  <div
                    key={c}
                    className="flex-1 h-full w-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div
                className={cn(
                  theme === option.id ? "opacity-100" : "opacity-50"
                )}
              >
                {t(option.labelKey)}
              </div>
            </button>
            {index < themeOptions.length - 1 && (
              <div className="opacity-50">/</div>
            )}
          </Fragment>
        ))}
      </div>
    </motion.div>
  )
}

const LanguageSettings = (props: HTMLMotionProps<"div">) => {
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("navigation")
  const { setIsOpen } = useNavbar()

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false)

    setTimeout(() => {
      router.replace(pathname, { locale: newLocale })
    }, 550)
  }

  return (
    <motion.div className="flex flex-col justify-between space-y-1">
      <div className="">{t("language")}</div>
      <div className="flex items-center gap-2">
        {localeOptions.map((option, index) => (
          <Fragment key={option.id}>
            <button
              className={cn(
                "",
                currentLocale === option.id ? "opacity-100" : "opacity-50"
              )}
              onClick={() => handleLocaleChange(option.id)}
            >
              {option.title}
            </button>
            {index < localeOptions.length - 1 && (
              <div className="opacity-50">/</div>
            )}
          </Fragment>
        ))}
      </div>
    </motion.div>
  )
}

export const Navbar = {
  Root,
  Header,
  Portal,
  Content,
  Trigger,
  Backdrop,
  HeaderBackdrop,
  Variants: {
    container: containerVariants,
    list: listVariants,
    item: itemVariants,
  },
  Time: NavbarTime,
  LinkItem,
  ThemeSettings,
  LanguageSettings,
}

const LinkBox = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      {...props}
      className="lg:aspect-21/9 w-full border-b grid pb-4"
    />
  )
}

export const RenderNavbar = () => {
  const t = useTranslations("navigation")

  return (
    <Fragment>
      <Navbar.HeaderBackdrop />
      <Navbar.Backdrop />
      <Navbar.Portal>
        <Navbar.Content>
          <motion.div
            variants={Navbar.Variants.container}
            className="p-5 grid lg:grid-cols-2 border-t content-between lg:content-start gap-5 pb-20"
          >
            <motion.ul
              className="grid grid-cols-2 gap-5"
              variants={Navbar.Variants.item}
            >
              <LinkBox>
                <Navbar.LinkItem href="/">{t("home")}</Navbar.LinkItem>
              </LinkBox>
              <LinkBox>
                <Navbar.LinkItem href="/resume">{t("resume")}</Navbar.LinkItem>
              </LinkBox>
              <LinkBox>
                <Navbar.LinkItem href="/works">{t("works")}</Navbar.LinkItem>
              </LinkBox>
              <LinkBox>
                <Navbar.LinkItem href="/writings">
                  {t("writings")}
                </Navbar.LinkItem>
              </LinkBox>
            </motion.ul>
            <motion.div
              variants={Navbar.Variants.item}
              className="grid lg:grid-cols-2 gap-5"
            >
              <LinkBox>
                <Navbar.ThemeSettings />
              </LinkBox>
              <LinkBox>
                <Navbar.LanguageSettings />
              </LinkBox>
            </motion.div>
          </motion.div>
        </Navbar.Content>
        <Navbar.Header>
          <Navbar.Trigger />
          <div className="hidden lg:block"></div>
          <div className="flex justify-end p-5">
            <Navbar.Time />
          </div>
        </Navbar.Header>
      </Navbar.Portal>
    </Fragment>
  )
}
