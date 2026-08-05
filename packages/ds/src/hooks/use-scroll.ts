"use client"

import {
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react"
import { type RefObject, useEffect, useMemo, useRef, useState } from "react"

type UseScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>

export function useRefScroll<T extends HTMLElement = HTMLDivElement>(
  options?: Omit<UseScrollOptions, "target">
) {
  const ref = useRef<T>(null)
  const scroll = useScroll({
    ...options,
    target: ref,
    offset: ["start start", "end end"],
  })

  return { ref, ...scroll }
}

export function useScrollProgressPercent(scrollYProgress: MotionValue<number>) {
  const [percent, setPercent] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 100))
  })

  return percent
}

export type ScrollProgressChunk = {
  start: number
  end: number
}

export function getScrollProgressChunks(count: number): ScrollProgressChunk[] {
  if (count <= 0) return []

  const size = 1 / count

  return Array.from({ length: count }, (_, index) => ({
    start: index * size,
    end: index === count - 1 ? 1 : (index + 1) * size,
  }))
}

export function useScrollProgressChunks(count: number): ScrollProgressChunk[] {
  return useMemo(() => getScrollProgressChunks(count), [count])
}

export function getAnimationProgress(
  scrollProgress: number,
  animationEndAt = 1,
  animationStartAt = 0
): number {
  if (animationEndAt <= animationStartAt) return 1
  if (scrollProgress <= animationStartAt) return 0
  if (scrollProgress >= animationEndAt) return 1

  return (
    (scrollProgress - animationStartAt) / (animationEndAt - animationStartAt)
  )
}

export function getScrollIndex(progress: number, count: number): number {
  if (count <= 0) return 0

  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)))
}

export type UseScrollIndexOptions = {
  animationStartAt?: number
  animationEndAt?: number
}

export function useScrollIndex(
  scrollYProgress: MotionValue<number>,
  count: number,
  options?: UseScrollIndexOptions
) {
  const animationStartAt = options?.animationStartAt ?? 0
  const animationEndAt = options?.animationEndAt ?? 1

  const scrollIndex = useTransform(scrollYProgress, (latest) =>
    getScrollIndex(
      getAnimationProgress(latest, animationEndAt, animationStartAt),
      count
    )
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollIndex, "change", (latest) => {
    setActiveIndex(latest)
  })

  useEffect(() => {
    setActiveIndex(
      getScrollIndex(
        getAnimationProgress(
          scrollYProgress.get(),
          animationEndAt,
          animationStartAt
        ),
        count
      )
    )
  }, [scrollYProgress, count, animationStartAt, animationEndAt])

  return activeIndex
}

export type UseWheelStepCountOptions = {
  threshold?: number
  totalStep?: number
  interval?: number
  target?: RefObject<HTMLElement | null>
}

const DEFAULT_STEP_INTERVAL_MS = 200

export function useWheelStepCount(options?: UseWheelStepCountOptions) {
  const threshold = options?.threshold ?? 10
  const totalStep = options?.totalStep ?? 10
  const interval = options?.interval ?? DEFAULT_STEP_INTERVAL_MS
  const target = options?.target
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const accumulatedDeltaRef = useRef(0)
  const isListeningRef = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const element = target?.current ?? window
    const maxStep = totalStep ?? Number.POSITIVE_INFINITY

    const clampCount = (value: number) => Math.min(maxStep, Math.max(0, value))

    const clearCooldown = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const startCooldown = () => {
      isListeningRef.current = false
      clearCooldown()

      timeoutRef.current = setTimeout(() => {
        isListeningRef.current = true
        timeoutRef.current = null
      }, interval)
    }

    const onWheel = (event: Event) => {
      if (!isListeningRef.current) return
      if (!(event instanceof WheelEvent) || event.deltaY === 0) return

      accumulatedDeltaRef.current += event.deltaY

      let direction = 0

      if (accumulatedDeltaRef.current >= threshold) {
        accumulatedDeltaRef.current = 0
        direction = 1
      } else if (accumulatedDeltaRef.current <= -threshold) {
        accumulatedDeltaRef.current = 0
        direction = -1
      }

      if (direction === 0) return

      const next = clampCount(countRef.current + direction)
      if (next === countRef.current) return

      countRef.current = next
      setCount(next)
      startCooldown()
    }

    element.addEventListener("wheel", onWheel, { passive: true })

    return () => {
      element.removeEventListener("wheel", onWheel)
      clearCooldown()
      isListeningRef.current = true
    }
  }, [target, threshold, totalStep, interval])

  return count
}
