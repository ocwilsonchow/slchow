"use client"

import { cn, isActivePath } from "@slchow/ds"
import { Portal } from "@slchow/ds/components/ui/portal"
import { useLenis } from "lenis/react"
import { PlusIcon } from "lucide-react"
import { type HTMLMotionProps, motion } from "motion/react"
import { useTranslations } from "next-intl"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { LocaleSelect } from "@/features/navigations/components/locale-select"
import { Link, usePathname } from "@/i18n/navigation"

type NavbarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  menuRef: React.RefObject<HTMLDivElement | null>
}

const NavbarContext = createContext<NavbarContextValue | null>(null)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target

      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable=true]")
      ) {
        return
      }

      if (event.key === "Escape") {
        setOpen(false)
        return
      }

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((previous) => !previous)
        return
      }

      if (!open || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) {
        return
      }

      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("[data-navbar-item]") ??
          []
      )

      if (!items.length) {
        return
      }

      event.preventDefault()

      const currentIndex = items.indexOf(document.activeElement as HTMLElement)
      const nextIndex =
        event.key === "ArrowDown"
          ? currentIndex === -1 || currentIndex === items.length - 1
            ? 0
            : currentIndex + 1
          : currentIndex <= 0
            ? items.length - 1
            : currentIndex - 1

      items[nextIndex]?.focus()
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("[data-navbar-item]")?.focus()
    })
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    lenis?.stop()

    return () => {
      lenis?.start()
    }
  }, [open, lenis])

  return (
    <NavbarContext.Provider value={{ open, setOpen, menuRef }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)

  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider")
  }

  return context
}

export const NavbarRoot = ({
  children,
  className,
  ...props
}: HTMLMotionProps<"nav">) => {
  return (
    <motion.nav
      className={cn(
        "h-[64px] fixed top-0 left-0 right-0 z-50 bg-surface-canvas flex items-center justify-between px-3 lg:px-10 max-w-screen-2xl mx-auto",
        className
      )}
      {...props}
    >
      <motion.div className="flex items-center">{children}</motion.div>
      <div className="flex items-center gap-2">
        <LocaleSelect />
      </div>
    </motion.nav>
  )
}

export const NavbarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) => {
  const { open, setOpen } = useNavbar()
  const t = useTranslations("navigation")

  return (
    <button
      type="button"
      aria-expanded={open}
      className={cn(
        "uppercase py-1 px-3 pr-1.5 hover:bg-surface-hover text-content-ink w-36 hover:text-brand-content-primary cursor-pointer flex justify-start items-center outline-none",
        className,
        open && "bg-brand-surface-alpha text-brand-content-primary"
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(!open)
        }
      }}
      {...props}
    >
      {open ? t("close") : t("menu")}
      <PlusIcon
        size={15}
        strokeWidth={1.25}
        className={cn(
          "ml-auto transition-transform duration-300",
          open ? "rotate-135" : "rotate-0"
        )}
      />
    </button>
  )
}

export const NavbarContent = ({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) => {
  const { open, menuRef } = useNavbar()

  return (
    <Portal
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-[64px] left-0 right-0 z-40 px-3 lg:px-10 grid overflow-hidden max-w-screen-2xl mx-auto",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <motion.div
        ref={menuRef}
        className={cn(
          "grid overflow-hidden bg-surface-popover",

          className
        )}
        variants={{
          closed: { height: 0, opacity: 1 },
          open: { height: "100%", opacity: 1 },
        }}
        initial="closed"
        animate={open ? "open" : "closed"}
        {...props}
      >
        {children}
      </motion.div>
    </Portal>
  )
}

export const NavbarMenuGroup = ({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      className={cn("grid content-start px-0 pt-3 gap-px", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const NavbarMenuGroupLabel = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "uppercase opacity-75 text-xs pb-1 px-3 border border-transparent",
        className
      )}
      {...props}
    />
  )
}

export const NavbarMenuGroupItem = ({
  children,
  className,
  href,
  ...props
}: React.ComponentProps<typeof Link>) => {
  const { setOpen } = useNavbar()
  const pathname = usePathname()
  const isActive =
    typeof href === "string" ? isActivePath(pathname, href) : false
  return (
    <Link
      data-navbar-item
      href={href}
      onClick={() => setOpen(false)}
      {...props}
      className={cn(
        "hover:border-stroke-default border border-transparent px-3 py-1 hover:bg-surface-hover uppercase text-content-ink hover:text-brand-content-primary focus-visible:outline-none focus-visible:bg-surface-hover focus-visible:text-brand-content-primary",
        isActive &&
          "border-stroke-default bg-brand-surface-alpha text-brand-content-primary hover:text-brand-content-primary",
        className
      )}
    >
      {children}
    </Link>
  )
}

export function Navbar() {
  const t = useTranslations("navigation")

  return (
    <NavbarProvider>
      <NavbarRoot>
        <NavbarTrigger />
        <NavbarContent className="grid ">
          <div className="grid lg:grid-cols-2">
            <NavbarMenuGroup>
              <NavbarMenuGroupLabel>{t("menu")}</NavbarMenuGroupLabel>
              <NavbarMenuGroupItem href="/">{t("home")}</NavbarMenuGroupItem>
              <NavbarMenuGroupItem href="/about">
                {t("about")}
              </NavbarMenuGroupItem>
              <NavbarMenuGroupItem href="/components">
                {t("components")}
              </NavbarMenuGroupItem>
              <NavbarMenuGroupItem href="/contact">
                {t("contact")}
              </NavbarMenuGroupItem>
            </NavbarMenuGroup>
            <NavbarMenuGroup>
              <NavbarMenuGroupLabel>{t("preferences")}</NavbarMenuGroupLabel>
            </NavbarMenuGroup>
          </div>
        </NavbarContent>
      </NavbarRoot>
    </NavbarProvider>
  )
}
