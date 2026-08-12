"use client"

import posthog from "posthog-js"
import { useEffect } from "react"

let initialized = false

export function PostHogProvider({
  token,
  children,
}: {
  token: string | undefined
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!token || initialized) return

    posthog.init(token, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-05-30",
      // Pageviews only — avoid capturing contact-form inputs/clicks.
      autocapture: false,
      capture_exceptions: true,
    })
    initialized = true
  }, [token])

  return children
}
