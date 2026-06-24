"use client"

import { cn, isActivePath } from "@slchow/ds"
import { Portal } from "@slchow/ds/components/ui/portal"
import { type HTMLMotionProps, motion } from "motion/react"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { Link, usePathname } from "@/i18n/navigation"

type NavbarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const NavbarContext = createContext<NavbarContextValue | null>(null)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <NavbarContext.Provider value={{ open, setOpen }}>
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
}: React.ComponentProps<"nav">) => {
  return (
    <nav
      className={cn(
        "h-[50px] fixed top-0 left-0 right-0 z-50 bg-surface-canvas flex border-b max-w-screen-2xl mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

export const NavbarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) => {
  const { open, setOpen } = useNavbar()

  return (
    <button
      type="button"
      aria-expanded={open}
      className={cn(
        "uppercase text-content-ink w-64 hover:text-brand-content-primary cursor-pointer px-5 flex justify-start items-center",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(!open)
        }
      }}
      {...props}
    >
      {open ? "Close" : "Menu"}
    </button>
  )
}

export const NavbarContent = ({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) => {
  const { open } = useNavbar()

  return (
    <Portal className="fixed inset-y-0 inset-0 z-40 grid pt-[50px] overflow-hidden max-w-screen-2xl mx-auto">
      <motion.div
        className={cn(
          "grid overflow-hidden bg-surface-canvas 2xl:border-x",
          open && "border-b",
          className
        )}
        variants={{
          closed: { height: 0, opacity: 0 },
          open: { height: "fit-content", opacity: 1 },
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
    <motion.div className={cn("grid content-start py-5", className)} {...props}>
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
        "uppercase text-content-muted text-xs tracking-wide px-5 pb-1.5",
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
      href={href}
      onClick={() => setOpen(false)}
      {...props}
      className={cn(
        "px-5 py-1.5 uppercase text-content-ink hover:text-brand-content-primary text-base",
        isActive && "text-brand-content-primary",
        className
      )}
    >
      {children}
    </Link>
  )
}

export function Navbar() {
  return (
    <NavbarProvider>
      <NavbarRoot>
        <NavbarTrigger />
        <NavbarContent className="grid lg:grid-cols-2">
          <NavbarMenuGroup>
            <NavbarMenuGroupLabel>Menu</NavbarMenuGroupLabel>
            <NavbarMenuGroupItem href="/">Home</NavbarMenuGroupItem>
            <NavbarMenuGroupItem href="/about">About</NavbarMenuGroupItem>
            <NavbarMenuGroupItem href="/components">
              Components
            </NavbarMenuGroupItem>
            <NavbarMenuGroupItem href="/contact">Contact</NavbarMenuGroupItem>
          </NavbarMenuGroup>

          <div></div>
        </NavbarContent>
      </NavbarRoot>
    </NavbarProvider>
  )
}
