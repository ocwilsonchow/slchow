"use client"

import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

export const ul = ({ ...props }: ComponentProps<"ul">) => {
  return (
    <ul {...props} className={cn("list-disc list-inside", props.className)}>
      {props.children}
    </ul>
  )
}
