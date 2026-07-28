"use client"

import { cn } from "@repo/ds"
import { motion, type HTMLMotionProps } from "motion/react"

export const PageLayout = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      {...props}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className={cn("min-h-dvh", props.className)}
    />
  )
}
