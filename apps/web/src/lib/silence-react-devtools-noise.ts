"use client"

const NOISE_PATTERNS = [
  "React instrumentation encountered an error",
  "The children should not have changed if we pass in the same set",
] as const

declare global {
  interface Window {
    __SILENCE_REACT_DEVTOOLS_NOISE__?: boolean
  }
}

function shouldSilence(args: unknown[]) {
  const message = args
    .map((arg) => {
      if (typeof arg === "string") return arg
      if (arg instanceof Error) return arg.message
      return ""
    })
    .join(" ")

  return NOISE_PATTERNS.some((pattern) => message.includes(pattern))
}

export function silenceReactDevtoolsNoise() {
  if (process.env.NODE_ENV !== "development") return
  if (typeof window === "undefined") return
  if (window.__SILENCE_REACT_DEVTOOLS_NOISE__) return

  window.__SILENCE_REACT_DEVTOOLS_NOISE__ = true

  for (const method of ["error", "warn"] as const) {
    const original = console[method].bind(console)
    console[method] = (...args: unknown[]) => {
      if (shouldSilence(args)) return
      original(...args)
    }
  }
}
