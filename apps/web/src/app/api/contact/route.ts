import { NextResponse } from "next/server"
import { z } from "zod"
import { sendContactDiscordEmbed } from "@/features/contact/lib/discord"
import { isSstProduction } from "@/features/contact/lib/stage"
import {
  getClientIp,
  verifyTurnstileToken,
} from "@/features/contact/lib/turnstile"
import {
  type ContactApiFailure,
  contactRequestSchema,
} from "@/features/contact/schema"

function jsonError(
  status: number,
  source: ContactApiFailure["source"],
  errors: unknown
) {
  return NextResponse.json(
    { ok: false, errors, source } satisfies ContactApiFailure,
    { status }
  )
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin")
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  return Boolean(origin && siteUrl && origin === siteUrl)
}

export async function POST(request: Request) {
  const production = isSstProduction()

  if (production && !isAllowedOrigin(request)) {
    return jsonError(403, "origin", [{ message: "forbidden" }])
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, "validation", [{ message: "invalid" }])
  }

  const parsed = contactRequestSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(422, "validation", z.treeifyError(parsed.error))
  }

  if (production) {
    const verification = await verifyTurnstileToken({
      token: parsed.data.turnstileToken,
      remoteip: getClientIp(request),
    })

    if (!verification.ok && verification.reason === "config") {
      return jsonError(500, "turnstile", [{ message: "unavailable" }])
    }

    if (!verification.ok) {
      return jsonError(403, "turnstile", [{ message: "forbidden" }])
    }

    const delivered = await sendContactDiscordEmbed({
      fields: {
        name: parsed.data.name,
        email: parsed.data.email,
        intent: parsed.data.intent,
        message: parsed.data.message,
      },
      locale: parsed.data.locale,
    })

    if (!delivered.ok) {
      return jsonError(502, "discord", [{ message: "undelivered" }])
    }
  } else {
    console.info("contact: accepted")
  }

  return NextResponse.json({ ok: true as const })
}
