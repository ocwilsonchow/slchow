import "server-only"

import { Resource } from "sst"
import { TURNSTILE_TOKEN_MAX_LENGTH } from "../schema"
import { isSstProduction } from "./stage"
import { TURNSTILE_ACTION } from "./turnstile-constants"

export function getTurnstileSecret(): string | undefined {
  if (!isSstProduction()) return undefined

  try {
    const value = (
      Resource as typeof Resource & {
        TURNSTILE_SECRET: { value: string }
      }
    ).TURNSTILE_SECRET.value
    return value || undefined
  } catch {
    return undefined
  }
}

export function getTurnstileHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  )
}

export function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }

  return request.headers.get("cf-connecting-ip") ?? undefined
}

type SiteverifyResult =
  | { ok: true }
  | { ok: false; reason: "config" | "verify" }

export async function verifyTurnstileToken(options: {
  token: string
  remoteip?: string
}): Promise<SiteverifyResult> {
  const secret = getTurnstileSecret()
  const expectedHostnames = getTurnstileHostnames()

  if (!secret || expectedHostnames.size === 0) {
    return { ok: false, reason: "config" }
  }

  if (
    options.token.length === 0 ||
    options.token.length > TURNSTILE_TOKEN_MAX_LENGTH
  ) {
    return { ok: false, reason: "verify" }
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body: new URLSearchParams({
          secret,
          response: options.token,
          ...(options.remoteip ? { remoteip: options.remoteip } : {}),
        }),
      }
    )

    if (!response.ok) return { ok: false, reason: "verify" }

    const result: unknown = await response.json()
    if (
      typeof result !== "object" ||
      result === null ||
      !("success" in result) ||
      result.success !== true ||
      !("action" in result) ||
      result.action !== TURNSTILE_ACTION ||
      !("hostname" in result) ||
      typeof result.hostname !== "string" ||
      !expectedHostnames.has(result.hostname)
    ) {
      return { ok: false, reason: "verify" }
    }

    return { ok: true }
  } catch {
    return { ok: false, reason: "verify" }
  }
}
