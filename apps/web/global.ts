import type { en } from "@slchow/intl"
import type { formats } from "@/i18n/request"
import type { routing } from "@/i18n/routing"

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof en
    Formats: typeof formats
  }
}
