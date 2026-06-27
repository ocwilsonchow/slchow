import { components } from "collections/server"
import { loader } from "fumadocs-core/source"

import { i18n } from "@/lib/i18n"

export const componentSource = loader({
  baseUrl: "/components",
  i18n,
  source: components.toFumadocsSource(),
})
