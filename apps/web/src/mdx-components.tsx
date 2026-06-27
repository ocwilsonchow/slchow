import { Button } from "@slchow/ds/components/ui/button"
import type { MDXComponents } from "mdx/types"

const globalComponents = {
  Button,
} satisfies MDXComponents

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...globalComponents,
    ...components,
  }
}
