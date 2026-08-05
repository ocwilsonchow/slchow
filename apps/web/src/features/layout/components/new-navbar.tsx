"use client"

import { cn } from "@repo/ds"
import { Portal } from "@repo/ds/components/ui/portal"
import { useLenis } from "lenis/react"
import { PlusIcon } from "lucide-react"
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import {
  type ComponentProps,
  Fragment,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react"
import { create } from "zustand"
import profilePicture from "@/assets/profile-pic.webp"
import { Link, usePathname } from "@/i18n/navigation"
import { LanguageSettings, ThemeSettings } from "./navbar-settings"
import { fontPresets } from "./styles"

const SITE_NAV_PANEL_ID = "site-nav-panel"
const SITE_NAV_TRIGGER_ID = "site-nav-trigger"

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",")

const listVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.25,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.4,
    },
  },
}

const reducedListVariants: Variants = {
  hidden: { transition: { duration: 0 } },
  visible: { transition: { duration: 0 } },
}

const reducedItemVariants: Variants = {
  hidden: { opacity: 1, transition: { duration: 0 } },
  visible: { opacity: 1, transition: { duration: 0 } },
}

export type NavbarState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useNavbar = create<NavbarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}))

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1
  )
}

const Backdrop = (props: HTMLMotionProps<"button">) => {
  const { isOpen, setIsOpen } = useNavbar()
  const t = useTranslations("navigation")
  const shouldReduceMotion = useReducedMotion()

  return (
    <Portal>
      <motion.button
        type="button"
        data-navbar-backdrop=""
        aria-label={t("close")}
        tabIndex={isOpen ? 0 : -1}
        {...(!isOpen ? { inert: true as const } : {})}
        {...props}
        variants={{
          hidden: {
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.35,
              delay: shouldReduceMotion ? 0 : 0.5,
            },
          },
          visible: {
            opacity: 1,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.25,
            },
          },
        }}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-surface-backdrop/65 backdrop-blur-sm",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
          props.className
        )}
      />
    </Portal>
  )
}

const Root = ({
  navRef,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Portal> & {
  navRef?: RefObject<HTMLElement | null>
}) => {
  const { isOpen, setIsOpen } = useNavbar()
  const t = useTranslations("navigation")
  const [isMobile, setIsMobile] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const wasOpenRef = useRef(false)

  const lenis = useLenis(
    ({ scroll, velocity }) => {
      if (!isMobile || scroll <= 0) {
        setIsScrollingDown(false)
        return
      }

      if (velocity !== 0) {
        setIsScrollingDown(velocity > 0)
      }
    },
    [isMobile]
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches)
      if (!mediaQuery.matches) setIsScrollingDown(false)
    }

    updateIsMobile()
    mediaQuery.addEventListener("change", updateIsMobile)

    return () => mediaQuery.removeEventListener("change", updateIsMobile)
  }, [])

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
      if (wasOpenRef.current) {
        document.getElementById(SITE_NAV_TRIGGER_ID)?.focus()
      }
      wasOpenRef.current = false
      return
    }

    wasOpenRef.current = true
    lenis?.stop()

    const panel = document.getElementById(SITE_NAV_PANEL_ID)
    const firstLink = panel?.querySelector<HTMLElement>("a[href], button")
    // Defer so the panel is interactive before focusing.
    requestAnimationFrame(() => firstLink?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key !== "Tab") return

      const nav = navRef?.current
      const backdrop = document.querySelector<HTMLElement>(
        "[data-navbar-backdrop]"
      )
      const containers = [nav, backdrop].filter((node): node is HTMLElement =>
        Boolean(node)
      )
      const focusables = containers.flatMap(getFocusableElements)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (!active || active === first || !focusables.includes(active)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (!active || active === last || !focusables.includes(active)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      lenis?.start()
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, lenis, setIsOpen, navRef])

  return (
    <Portal
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 grid content-end",
        fontPresets.aero,
        className
      )}
      {...props}
    >
      <motion.div
        animate={{
          y:
            isMobile && isScrollingDown && !isOpen ? "calc(100% + 1rem)" : "0%",
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: "easeInOut",
        }}
        className="grid md:grid-cols-2 xl:grid-cols-4"
      >
        <nav
          ref={navRef}
          aria-label={t("menu")}
          className="bg-surface-popover text-content-body-on-popover rounded-3xl"
        >
          {children}
        </nav>
      </motion.div>
    </Portal>
  )
}

const Content = ({ className, children, ...props }: HTMLMotionProps<"div">) => {
  const { isOpen } = useNavbar()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      {...props}
      id={SITE_NAV_PANEL_ID}
      aria-hidden={!isOpen}
      {...(!isOpen ? { inert: true as const } : {})}
      variants={
        shouldReduceMotion
          ? {
              hidden: { height: 0, transition: { duration: 0 } },
              visible: { height: "auto", transition: { duration: 0 } },
            }
          : {
              hidden: {
                height: 0,
                transition: {
                  when: "afterChildren",
                  staggerChildren: 0.06,
                  staggerDirection: -1,
                  type: "spring",
                  stiffness: 380,
                  damping: 42,
                },
              },
              visible: {
                height: "auto",
                transition: {
                  delayChildren: 0.165,
                  type: "spring",
                  stiffness: 400,
                  damping: 42,
                },
              },
            }
      }
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      className={cn("flex flex-col overflow-hidden", className)}
    >
      {children}
    </motion.div>
  )
}

const Trigger = (props: HTMLMotionProps<"button">) => {
  const { isOpen } = useNavbar()

  return (
    <motion.button
      id={SITE_NAV_TRIGGER_ID}
      type="button"
      aria-expanded={isOpen}
      aria-controls={SITE_NAV_PANEL_ID}
      {...props}
      className={cn(
        "p-3 w-full h-12 font-medium leading-none rounded-full flex items-center justify-between text-content-ink-on-popover",
        props.className
      )}
    />
  )
}

const StaggerList = (props: HTMLMotionProps<"div">) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedListVariants : listVariants}
      {...props}
      className={cn("flex flex-col gap-px p-3", props.className)}
    >
      {props.children}
    </motion.div>
  )
}

const StaggerItem = (props: HTMLMotionProps<"div">) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedItemVariants : itemVariants}
      {...props}
    >
      {props.children}
    </motion.div>
  )
}

const NavbarLink = ({
  className,
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) => {
  const pathname = usePathname()
  const { setIsOpen } = useNavbar()
  const hrefPath = typeof href === "string" ? href : href.pathname
  const isActive =
    hrefPath === "/"
      ? pathname === "/"
      : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        setIsOpen(false)
        onClick?.(event)
      }}
      className={cn(
        "block transition-colors hover:text-content-ink-on-popover py-0.5 font-semibold text-base",
        isActive
          ? "text-content-ink-on-popover"
          : "text-content-body-on-popover",
        className
      )}
    />
  )
}

export const NewNavbar = {
  Root,
  Backdrop,
  Trigger,
  Content,
  StaggerList,
  StaggerItem,
  NavbarLink,
  ThemeSettings,
  LanguageSettings,
  Variants: {
    list: listVariants,
    item: itemVariants,
  },
}

const pathTitleKeys = {
  "/": "homePage",
  "/resume": "resume",
  "/works": "works",
  "/notes": "notes",
  "/contact": "contact",
} as const

export const RenderNewNavbar = () => {
  const { isOpen, setIsOpen } = useNavbar()
  const pathname = usePathname()
  const t = useTranslations("navigation")
  const tA11y = useTranslations("a11y")
  const shouldReduceMotion = useReducedMotion()
  const navRef = useRef<HTMLElement | null>(null)

  const pathTitleKey =
    pathTitleKeys[pathname as keyof typeof pathTitleKeys] ??
    (pathname.startsWith("/notes/")
      ? "notes"
      : pathname.startsWith("/works/")
        ? "works"
        : null)
  const pathLabel = pathTitleKey ? t(pathTitleKey) : pathname.replace(/^\//, "")

  return (
    <Fragment>
      <NewNavbar.Backdrop />
      <NewNavbar.Root navRef={navRef}>
        <AnimatePresence>
          <NewNavbar.Content>
            <NewNavbar.StaggerList className="p-5">
              <NewNavbar.StaggerItem>
                <NewNavbar.NavbarLink href="/">
                  {t("home")}
                </NewNavbar.NavbarLink>
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <NewNavbar.NavbarLink href="/resume">
                  {t("resume")}
                </NewNavbar.NavbarLink>
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <NewNavbar.NavbarLink href="/notes">
                  {t("notes")}
                </NewNavbar.NavbarLink>
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <NewNavbar.NavbarLink href="/works">
                  {t("works")}
                </NewNavbar.NavbarLink>
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <span className="block py-0.5 font-semibold text-base text-content-body-on-popover">
                  {t("designs")} ({t("comingSoon")})
                </span>
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <NewNavbar.NavbarLink href="/contact">
                  {t("contact")}
                </NewNavbar.NavbarLink>
              </NewNavbar.StaggerItem>
            </NewNavbar.StaggerList>
            <NewNavbar.StaggerList className="p-5 space-y-3">
              <NewNavbar.StaggerItem>
                <NewNavbar.ThemeSettings />
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <NewNavbar.LanguageSettings
                  onBeforeChange={() => setIsOpen(false)}
                />
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem className="space-y-1">
                <div className="text-xs text-content-body-on-popover mt-1.5">
                  {t("socials")}
                </div>
                <div className="flex items-center flex-wrap gap-x-2">
                  <Link
                    href="https://github.com/ocwilsonchow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-content-ink-on-popover"
                  >
                    GitHub
                  </Link>
                  <div aria-hidden className="text-content-body-on-popover">
                    /
                  </div>
                  <Link
                    href="https://www.linkedin.com/in/wilsonslchow/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-content-ink-on-popover"
                  >
                    LinkedIn
                  </Link>
                  <div aria-hidden className="text-content-body-on-popover">
                    /
                  </div>
                  <Link
                    href="https://www.instagram.com/duoengineers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-content-ink-on-popover"
                  >
                    Instagram
                  </Link>
                </div>
              </NewNavbar.StaggerItem>
              <div className="h-3" />
            </NewNavbar.StaggerList>
          </NewNavbar.Content>
        </AnimatePresence>
        <NewNavbar.Trigger onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center justify-center gap-4">
            <Image
              src={profilePicture}
              alt={tA11y("profileAlt")}
              width={28}
              height={28}
              sizes="28px"
              priority
              className="rounded-full"
            />
            <div className="flex items-center gap-1.5 font-semibold">
              <div>Wilson</div>
              <div aria-hidden className="text-content-body-on-popover text-xs">
                /
              </div>
              <div className="text-content-body-on-popover capitalize">
                {pathLabel}
              </div>
            </div>
          </div>
          <div>
            <motion.div
              variants={{
                hidden: {
                  rotate: 0,
                  transition: {
                    delay: shouldReduceMotion ? 0 : 0.25,
                    ease: "easeIn",
                    duration: shouldReduceMotion ? 0 : undefined,
                  },
                },
                visible: {
                  rotate: 135,
                  transition: {
                    ease: "easeOut",
                    duration: shouldReduceMotion ? 0 : undefined,
                  },
                },
              }}
              initial="hidden"
              animate={isOpen ? "visible" : "hidden"}
            >
              <PlusIcon size={16} strokeWidth={3} aria-hidden />
            </motion.div>
          </div>
        </NewNavbar.Trigger>
      </NewNavbar.Root>
    </Fragment>
  )
}
