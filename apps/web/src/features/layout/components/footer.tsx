"use client"

import { cn } from "@repo/ds"
import { HTMLMotionProps, motion } from "motion/react"

export const Root = (props: HTMLMotionProps<"footer">) => {
  return <motion.footer {...props} className={cn("grid lg:grid-cols-4 p-4")} />
}

export const Footer = {
  Root,
}

export const RenderFooter = () => {
  return (
    <Footer.Root>
      <div>Footer</div>
      <div></div>
      <div></div>
      <div></div>
    </Footer.Root>
  )
}
