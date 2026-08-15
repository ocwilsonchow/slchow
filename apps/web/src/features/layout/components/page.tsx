"use client"

import { cn } from "@repo/ds"
import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react"

export const PageLayout = (props: HTMLMotionProps<"main">) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.main
      {...props}
      id="main-content"
      variants={{
        initial: { opacity: shouldReduceMotion ? 1 : 0 },
        animate: { opacity: 1 },
        exit: { opacity: shouldReduceMotion ? 1 : 0 },
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
        ease: "easeInOut",
      }}
      className={cn("", props.className)}
    />
  )
}
