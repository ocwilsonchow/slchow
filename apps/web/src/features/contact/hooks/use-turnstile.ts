import { useCallback, useEffect, useRef } from "react"
import {
  TURNSTILE_ACTION,
  TURNSTILE_SITE_KEY,
} from "../lib/turnstile-constants"

type TurnstileWidgetId = string

type TurnstileRenderOptions = {
  sitekey: string
  action: string
  execution: "execute"
  appearance: "execute"
  callback: (token: string) => void
  "error-callback": () => void
  "expired-callback": () => void
}

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions
  ) => TurnstileWidgetId
  execute: (widgetId: TurnstileWidgetId) => void
  reset: (widgetId: TurnstileWidgetId) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const EXECUTE_TIMEOUT_MS = 15_000

export function useTurnstile(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null)
  const pendingRef = useRef<{
    resolve: (token: string) => void
    reject: (error: Error) => void
    timeout: number
  } | null>(null)

  const settlePending = useCallback((error?: Error, token?: string) => {
    const pending = pendingRef.current
    if (!pending) return
    window.clearTimeout(pending.timeout)
    pendingRef.current = null
    if (error) pending.reject(error)
    else pending.resolve(token ?? "")
  }, [])

  const renderWidget = useCallback(() => {
    if (
      !enabled ||
      !containerRef.current ||
      widgetIdRef.current !== null ||
      !window.turnstile
    ) {
      return
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: TURNSTILE_ACTION,
      execution: "execute",
      appearance: "execute",
      callback: (token) => settlePending(undefined, token),
      "error-callback": () => settlePending(new Error("turnstile-error")),
      "expired-callback": () => settlePending(new Error("turnstile-expired")),
    })
  }, [enabled, settlePending])

  useEffect(() => {
    renderWidget()
  }, [renderWidget])

  const execute = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      if (!enabled) {
        resolve("")
        return
      }

      if (!widgetIdRef.current || !window.turnstile) {
        reject(new Error("turnstile-unavailable"))
        return
      }

      const timeout = window.setTimeout(() => {
        settlePending(new Error("turnstile-timeout"))
      }, EXECUTE_TIMEOUT_MS)

      pendingRef.current = { resolve, reject, timeout }
      window.turnstile.execute(widgetIdRef.current)
    })
  }, [enabled, settlePending])

  const reset = useCallback(() => {
    settlePending(new Error("turnstile-reset"))
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [settlePending])

  return {
    containerRef,
    renderWidget,
    execute,
    reset,
  }
}
