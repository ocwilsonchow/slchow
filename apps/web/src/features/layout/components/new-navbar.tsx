"use client"

import { cn } from "@repo/ds"
import { Portal } from "@repo/ds/components/ui/portal"
import { PlusIcon } from "lucide-react"
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  type Variants,
} from "motion/react"
import { create } from "zustand"
import { fontPresets } from "./styles"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ComponentProps, Fragment, useEffect } from "react"
import { LanguageSettings, ThemeSettings } from "./navbar-settings"
import { useLenis } from "lenis/react"
import Image from "next/image"
import profilePicture from "@/assets/profile-pic.webp"

const listVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
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

export type NavbarState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useNavbar = create<NavbarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}))

const Backdrop = (props: HTMLMotionProps<"button">) => {
  const { isOpen, setIsOpen } = useNavbar()
  const t = useTranslations("navigation")

  return (
    <Portal>
      <motion.button
        type="button"
        aria-label={t("close")}
        {...props}
        variants={{
          hidden: {
            opacity: 0,
            transition: {
              duration: 0.35,
              delay: 0.5,
            },
          },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.25,
            },
          },
        }}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-surface-backdrop/65 backdrop-blur-sm outline-none",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
          props.className
        )}
      />
    </Portal>
  )
}

const Root = (props: React.ComponentProps<typeof Portal>) => {
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
    <Portal
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 grid content-end",
        fontPresets.aero
      )}
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-4">
        <motion.div className="bg-surface-popover text-content-body-on-popover rounded-3xl">
          {props.children}
        </motion.div>
        <div className="cursor-pointer" onClick={() => setIsOpen(false)} />
      </div>
    </Portal>
  )
}

const Content = (props: HTMLMotionProps<"div">) => {
  const { isOpen } = useNavbar()
  return (
    <motion.div
      variants={{
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
            delayChildren: 0.1,
            type: "spring",
            stiffness: 380,
            damping: 42,
          },
        },
      }}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      {...props}
      className={cn("flex flex-col overflow-hidden", props.className)}
    >
      {props.children}
    </motion.div>
  )
}

const Trigger = (props: HTMLMotionProps<"button">) => {
  return (
    <motion.button
      {...props}
      className={cn(
        "p-3 w-full h-12 font-medium leading-none rounded-full flex items-center justify-between text-content-ink-on-popover focus-visible:outline-none",
        props.className
      )}
    ></motion.button>
  )
}

const StaggerList = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      variants={listVariants}
      {...props}
      className={cn("flex flex-col gap-px p-3", props.className)}
    >
      {props.children}
    </motion.div>
  )
}

const StaggerItem = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div variants={itemVariants} {...props}>
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
  "/writings": "writings",
  "/contact": "contact",
} as const

export const RenderNewNavbar = () => {
  const { isOpen, setIsOpen } = useNavbar()
  const pathname = usePathname()
  const t = useTranslations("navigation")

  const pathTitleKey =
    pathTitleKeys[pathname as keyof typeof pathTitleKeys] ??
    (pathname.startsWith("/writings/")
      ? "writings"
      : pathname.startsWith("/works/")
        ? "works"
        : null)
  const pathLabel = pathTitleKey
    ? t(pathTitleKey)
    : pathname.replace(/^\//, "")

  return (
    <Fragment>
      <NewNavbar.Backdrop />
      <NewNavbar.Root>
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
                <NewNavbar.NavbarLink href="/writings">
                  {t("writings")}
                </NewNavbar.NavbarLink>
              </NewNavbar.StaggerItem>
              <NewNavbar.StaggerItem>
                <NewNavbar.NavbarLink href="/works">
                  {t("works")}
                </NewNavbar.NavbarLink>
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
              <div className="h-3" />
            </NewNavbar.StaggerList>
          </NewNavbar.Content>
        </AnimatePresence>
        <NewNavbar.Trigger onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center justify-center gap-4">
            <Image
              src={profilePicture}
              alt="Wilson Chow"
              width={28}
              height={28}
              className="rounded-full"
            />
            <div className="flex items-center gap-1.5 font-semibold">
              <div>Wilson</div>
              <div className="text-content-body-on-popover/50 text-xs">/</div>
              <div className="text-content-body-on-popover/50 capitalize">{pathLabel}</div>
            </div>
          </div>
          <div>
            <motion.div
              variants={{
                hidden: {
                  rotate: 0,
                  transition: {
                    delay: 0.25,
                    ease: "easeIn",
                  },
                },
                visible: {
                  rotate: 135,
                  transition: {
                    ease: "easeOut",
                  },
                },
              }}
              initial="hidden"
              animate={isOpen ? "visible" : "hidden"}
            >
              <PlusIcon size={16} strokeWidth={3} />
            </motion.div>
          </div>
        </NewNavbar.Trigger>
      </NewNavbar.Root>
    </Fragment>
  )
}
