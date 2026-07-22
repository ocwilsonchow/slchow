"use client"

import { cn } from "@repo/ds"
import { motion, type HTMLMotionProps } from "motion/react"

export const PageLayout = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      {...props}
      className={cn("min-h-screen", props.className)}
    />
  )
}
