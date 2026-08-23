"use client"

import { cn, useTheme } from "@repo/ds"
import { type Locale, useLocale, useTranslations } from "next-intl"
import { type ComponentProps, Fragment } from "react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { localeOptions } from "@/i18n/routing"
import { HTMLMotionProps, motion } from "motion/react"

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
  {
    id: "meta",
    labelKey: "themeMeta",
    color: ["#23272F"],
  },
] as const

function Root({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col", className)} {...props} />
}

function Label({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-xs text-content-body-on-popover/50 my-1.5",
        className
      )}
      {...props}
    />
  )
}

function List({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "m-0 flex items-center flex-wrap min-w-0 gap-5 border-0 p-0",
        className
      )}
      {...props}
    />
  )
}

function Option({
  selected = false,
  className,
  ...props
}: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col items-start gap-1",
        selected
          ? "text-content-ink-on-popover"
          : "text-content-body-on-popover",
        className
      )}
      {...props}
    />
  )
}

function Separator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden className={cn("opacity-50", className)} {...props}>
      /
    </div>
  )
}

function Swatch({
  colors,
  selected = false,
  label,
  className,
  ...props
}: HTMLMotionProps<"span"> & {
  colors: readonly string[]
  selected?: boolean
  label?: string
}) {
  return (
    <span className="relative">
      <motion.span
        whileTap={{ scale: 0.9 }}
        aria-hidden
        className={cn(
          "flex h-8 w-8 overflow-hidden rounded-full border-2 border-content-ink",
          selected &&
            "ring-2 ring-content-accent ring-offset-2 ring-offset-surface-popover",
          className
        )}
        {...props}
      >
        {colors.map((color) => (
          <span
            key={color}
            className="h-full w-full flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </motion.span>
      {label ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2",
            "whitespace-nowrap rounded-full bg-content-ink-on-popover px-2 py-1",
            "text-xs leading-none text-surface-popover",
            "opacity-0 transition-opacity duration-150",
            "group-hover:opacity-100 group-focus-visible:opacity-100"
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  )
}

export const Settings = {
  Root,
  Label,
  List,
  Option,
  Separator,
  Swatch,
}

type ThemeSettingsProps = ComponentProps<typeof Root>

export function ThemeSettings({ className, ...props }: ThemeSettingsProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("navigation")

  return (
    <Settings.Root className={className} {...props}>
      <Settings.Label>{t("theme")}</Settings.Label>
      <Settings.List aria-label={t("theme")}>
        {themeOptions.map((option) => (
          <Fragment key={option.id}>
            <Settings.Option
              selected={theme === option.id}
              aria-label={t(option.labelKey)}
              onClick={() => setTheme(option.id)}
            >
              <Settings.Swatch
                colors={option.color}
                selected={theme === option.id}
                label={t(option.labelKey)}
              />
            </Settings.Option>
            {/* {index < themeOptions.length - 1 ? <Settings.Separator /> : null} */}
          </Fragment>
        ))}
      </Settings.List>
    </Settings.Root>
  )
}

type LanguageSettingsProps = ComponentProps<typeof Root> & {
  /** Runs before the locale switch (e.g. close the navbar). */
  onBeforeChange?: () => void
  /** Delay navigation so exit animations can finish. */
  delayMs?: number
}

export function LanguageSettings({
  className,
  onBeforeChange,
  delayMs = 0,
  ...props
}: LanguageSettingsProps) {
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("navigation")

  const selectLocale = (nextLocale: Locale) => {
    if (nextLocale === currentLocale) return

    onBeforeChange?.()

    const navigate = () => {
      router.replace(pathname, { locale: nextLocale })
    }

    if (delayMs > 0) {
      window.setTimeout(navigate, delayMs)
      return
    }

    navigate()
  }

  return (
    <Settings.Root className={className} {...props}>
      <Settings.Label>{t("language")}</Settings.Label>
      <Settings.List aria-label={t("language")}>
        {localeOptions.map((option) => (
          <Fragment key={option.id}>
            <Settings.Option
              selected={currentLocale === option.id}
              onClick={() => selectLocale(option.id)}
            >
              {option.title}
            </Settings.Option>
            {/* {index < localeOptions.length - 1 ? <Settings.Separator /> : null} */}
          </Fragment>
        ))}
      </Settings.List>
    </Settings.Root>
  )
}
