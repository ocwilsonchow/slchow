"use client"

import { cn } from "@repo/ds"
import { type HTMLMotionProps, motion } from "motion/react"

export const Root = (props: HTMLMotionProps<"footer">) => {
  return (
    <motion.footer
      {...props}
      className={cn("p-5 min-h-[50vh] gap-5 flex flex-col text-xs")}
    />
  )
}

export const Footer = {
  Root,
}

export const RenderFooter = () => {
  return (
    <Footer.Root>
      <div className="flex-1"></div>
      <div className="h-px bg-stroke-soft" />
      <div className="grid lg:grid-cols-4">
        <div className="flex items-center gap-5">
          © {new Date().getFullYear()} Wilson Chow
        </div>
        <div></div>
        <div></div>
        <div className="flex items-center lg:justify-end gap-5">
          <div>Github</div>
          <div>Instagram</div>
          <div>LinkedIn</div>
        </div>
      </div>
    </Footer.Root>
  )
}
