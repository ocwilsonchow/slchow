"use client"

import { cn } from "@repo/ds"
import { Portal } from "@repo/ds/components/ui/portal"
import { PlusIcon } from "lucide-react"
import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { type ComponentProps, type ReactNode, useRef, useState } from "react"
import { Link as I18nLink, usePathname } from "@/i18n/navigation"
import { fontPresets } from "../styles"
import {
  NavbarContext,
  SITE_NAV_PANEL_ID,
  SITE_NAV_TRIGGER_ID,
  useNavbarContext,
} from "./context"
import {
  useMediaQuery,
  useNavbarFocusLock,
  useNavbarScrollHide,
  useOpenOnModK,
} from "./hooks"
import {
  backdropVariants,
  contentVariants,
  itemVariants,
  listVariants,
  reducedBackdropVariants,
  reducedContentVariants,
  reducedItemVariants,
  reducedListVariants,
  reducedTriggerIconVariants,
  triggerIconVariants,
} from "./variants"

function Root({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const backdropRef = useRef<HTMLButtonElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const shouldReduceMotion = useReducedMotion() ?? false

  const toggle = () => setOpen((current) => !current)

  useOpenOnModK(setOpen)
  useNavbarFocusLock({
    open,
    navRef,
    backdropRef,
    triggerRef,
    panelRef,
    setOpen,
  })

  return (
    <NavbarContext
      value={{
        open,
        setOpen,
        toggle,
        navRef,
        panelRef,
        backdropRef,
        triggerRef,
        shouldReduceMotion,
      }}
    >
      {children}
    </NavbarContext>
  )
}

function Backdrop({ className, ...props }: HTMLMotionProps<"button">) {
  const { open, setOpen, backdropRef, shouldReduceMotion } = useNavbarContext()
  const t = useTranslations("navigation")

  return (
    <Portal>
      <motion.button
        ref={backdropRef}
        type="button"
        data-navbar-backdrop=""
        aria-label={t("close")}
        tabIndex={open ? 0 : -1}
        {...(!open ? { inert: true as const } : {})}
        {...props}
        variants={
          shouldReduceMotion ? reducedBackdropVariants : backdropVariants
        }
        initial="hidden"
        animate={open ? "visible" : "hidden"}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-surface-backdrop/65 backdrop-blur-sm",
          open ? "pointer-events-auto" : "pointer-events-none",
          className
        )}
      />
    </Portal>
  )
}

function Frame({
  children,
  className,
  ...props
}: ComponentProps<typeof Portal>) {
  const { open, navRef, shouldReduceMotion } = useNavbarContext()
  const t = useTranslations("navigation")
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isScrollingDown = useNavbarScrollHide(isMobile, open)

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
          y: isMobile && isScrollingDown && !open ? "calc(100% + 1rem)" : "0%",
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

function Content({ className, children, ...props }: HTMLMotionProps<"div">) {
  const { open, panelRef, shouldReduceMotion } = useNavbarContext()

  return (
    <motion.div
      {...props}
      ref={panelRef}
      id={SITE_NAV_PANEL_ID}
      aria-hidden={!open}
      {...(!open ? { inert: true as const } : {})}
      variants={shouldReduceMotion ? reducedContentVariants : contentVariants}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      className={cn("flex flex-col overflow-hidden", className)}
    >
      {children}
    </motion.div>
  )
}

function Trigger({
  className,
  children,
  onClick,
  ...props
}: Omit<HTMLMotionProps<"button">, "children"> & { children?: ReactNode }) {
  const { open, toggle, triggerRef, shouldReduceMotion } = useNavbarContext()

  return (
    <motion.button
      ref={triggerRef}
      id={SITE_NAV_TRIGGER_ID}
      type="button"
      aria-expanded={open}
      aria-controls={SITE_NAV_PANEL_ID}
      {...props}
      onClick={(event) => {
        toggle()
        onClick?.(event)
      }}
      className={cn(
        "p-3 w-full h-12 font-medium leading-none rounded-full flex items-center justify-between text-content-ink-on-popover",
        className
      )}
    >
      {children}
      <motion.div
        variants={
          shouldReduceMotion ? reducedTriggerIconVariants : triggerIconVariants
        }
        initial="hidden"
        animate={open ? "visible" : "hidden"}
        className="bg-surface-alpha p-1.5 rounded-full"
      >
        <PlusIcon size={16} strokeWidth={4} aria-hidden />
      </motion.div>
    </motion.button>
  )
}

function StaggerList({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const { shouldReduceMotion } = useNavbarContext()

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedListVariants : listVariants}
      {...props}
      className={cn("flex flex-col gap-px p-3", className)}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const { shouldReduceMotion } = useNavbarContext()

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedItemVariants : itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function NavLink({
  className,
  href,
  onClick,
  ...props
}: ComponentProps<typeof I18nLink>) {
  const pathname = usePathname()
  const { setOpen } = useNavbarContext()
  const hrefPath = typeof href === "string" ? href : href.pathname
  const isActive =
    hrefPath === "/"
      ? pathname === "/"
      : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)

  return (
    <I18nLink
      href={href}
      {...props}
      onClick={(event) => {
        setOpen(false)
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

export const Navbar = {
  Root,
  Backdrop,
  Frame,
  Content,
  Trigger,
  StaggerList,
  StaggerItem,
  Link: NavLink,
}
