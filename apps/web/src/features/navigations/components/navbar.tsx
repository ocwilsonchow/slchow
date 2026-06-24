"use client"

import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { Slot } from "@slchow/ds/components/ui/slot"
import { isActivePath } from "@slchow/ds/lib/is-active-path"
import { cn } from "@slchow/ds/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@slchow/ds/components/ui/dropdown-menu"
import { Button } from "@slchow/ds/components/ui/button"
import { useTheme } from "@slchow/ds"
import { routing } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

export const NavbarRoot = (props: React.ComponentProps<"nav">) => {
  return (
    <div className="fixed top-0 left-0 right-0 p-3 pb-0">
      <nav
        className={cn(
          "border rounded-md overflow-hidden bg-surface-card",
          props.className
        )}
        {...props}
      >
        {props.children}
      </nav>
    </div>
  )
}

export const NavbarSeparator = () => {
  return <div className="h-4 w-px" />
}

export const NavbarGroup = (props: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex items-center", props.className)} {...props}>
      {props.children}
    </div>
  )
}

type NavbarItemProps =
  | (React.ComponentProps<typeof Link> & { asChild?: false })
  | (React.ComponentProps<typeof Slot> & { asChild: true })

export const NavbarItem = (props: NavbarItemProps) => {
  const pathname = usePathname()
  const { className } = props

  const itemClassName = (isActive = false) =>
    cn(
      "uppercase tracking-wide flex-1 flex items-center gap-2 px-3 py-1 rounded hover:bg-surface-hover hover:text-content-ink cursor-pointer",
      isActive &&
        "text-brand-content-primary hover:text-brand-content-primary",
      className
    )

  if (props.asChild) {
    const { asChild: _, className: __, ...slotProps } = props
    return <Slot className={itemClassName()} {...slotProps} />
  }

  const { asChild: _, className: __, href, ...linkProps } = props
  const hrefString = typeof href === "string" ? href : undefined
  const isActive = hrefString ? isActivePath(pathname, hrefString) : false

  return <Link className={itemClassName(isActive)} href={href} {...linkProps} />
}

export const Navbar = () => {
  const t = useTranslations("navigation")
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const themes = ["light", "dark", "system"] as const

  return (
    <NavbarRoot>
      <NavbarGroup>
        <NavbarItem href="/">{t("home")}</NavbarItem>
        <NavbarSeparator />
        <NavbarItem href="/about">{t("about")}</NavbarItem>
        <NavbarSeparator />
        <NavbarItem href="/components">{t("components")}</NavbarItem>
        <NavbarSeparator />
        <NavbarItem href="/search">{t("search")}</NavbarItem>
        <NavbarSeparator />
        <NavbarItem asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="uppercase tracking-wide flex-1 justify-start pr-1.5"
                variant="ghost"
              >
                {t("options")}
                <ChevronDownIcon className="ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup className="uppercase">
                <DropdownMenuLabel>{t("preferences")}</DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>{t("theme")}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      {themes.map((value) => (
                        <DropdownMenuItem
                          key={value}
                          onSelect={() => setTheme(value)}
                        >
                          {t(`themes.${value}`)}
                          {theme === value && (
                            <CheckIcon className="ml-auto size-3" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {t("language")}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      {routing.locales.map((loc) => (
                        <DropdownMenuItem
                          key={loc}
                          onSelect={() =>
                            router.replace(pathname, { locale: loc })
                          }
                        >
                          {t(`locales.${loc}`)}
                          {locale === loc && (
                            <CheckIcon className="ml-auto size-3" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavbarItem>
        <NavbarSeparator />
        <NavbarItem href="/contact">{t("contact")}</NavbarItem>
      </NavbarGroup>
    </NavbarRoot>
  )
}
