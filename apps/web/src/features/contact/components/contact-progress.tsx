"use client"

import { motion } from "motion/react"

type Props = {
  current: number
  total: number
  label: string
  reduceMotion: boolean
}

export function ContactProgress({
  current,
  total,
  label,
  reduceMotion,
}: Props) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      className="h-1 w-full overflow-hidden rounded-full bg-surface-alpha"
    >
      <motion.div
        className="h-full w-full origin-left rounded-full bg-content-ink"
        initial={false}
        animate={{ scaleX: current / total }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 32 }
        }
      />
    </div>
  )
}
