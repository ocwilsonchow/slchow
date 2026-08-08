"use client"

import { useEffect, useState } from "react"

const BREAKPOINTS = ["base", "sm", "md", "lg", "xl", "2xl"] as const

type Breakpoint = (typeof BREAKPOINTS)[number]

type BreakpointValues<T> = Partial<Record<Breakpoint, T>> & { base: T }

const MIN_WIDTHS: Record<Exclude<Breakpoint, "base">, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

function resolveBreakpointValue<T>(
  values: BreakpointValues<T>,
  width: number
): T {
  let resolved = values.base

  for (const breakpoint of BREAKPOINTS) {
    if (breakpoint === "base") continue
    if (!(breakpoint in values) || values[breakpoint] === undefined) continue
    if (width >= MIN_WIDTHS[breakpoint]) {
      resolved = values[breakpoint] as T
    }
  }

  return resolved
}

export function useBreakpointValues<T>(values: BreakpointValues<T>): T {
  const [value, setValue] = useState(() => values.base)

  const base = values.base
  const sm = values.sm
  const md = values.md
  const lg = values.lg
  const xl = values.xl
  const xxl = values["2xl"]

  useEffect(() => {
    const nextValues = {
      base,
      sm,
      md,
      lg,
      xl,
      "2xl": xxl,
    } as BreakpointValues<T>

    const queries = BREAKPOINTS.filter(
      (breakpoint): breakpoint is Exclude<Breakpoint, "base"> =>
        breakpoint !== "base" && nextValues[breakpoint] !== undefined
    ).map((breakpoint) =>
      window.matchMedia(`(min-width: ${MIN_WIDTHS[breakpoint]}px)`)
    )

    const update = () => {
      setValue(resolveBreakpointValue(nextValues, window.innerWidth))
    }

    update()

    for (const mediaQuery of queries) {
      mediaQuery.addEventListener("change", update)
    }

    return () => {
      for (const mediaQuery of queries) {
        mediaQuery.removeEventListener("change", update)
      }
    }
  }, [base, sm, md, lg, xl, xxl])

  return value
}
