import "server-only"

import { Resource } from "sst"
import {
  CONTACT_INTENT_LABELS,
  type ContactFields,
  type ContactLocale,
} from "../schema"
import { isSstProduction } from "./stage"

export function getContactDiscordWebhook(): string | undefined {
  if (!isSstProduction()) return undefined

  try {
    const value = (
      Resource as typeof Resource & {
        CONTACT_DISCORD_WEBHOOK: { value: string }
      }
    ).CONTACT_DISCORD_WEBHOOK.value
    return value || undefined
  } catch {
    return undefined
  }
}

export async function sendContactDiscordEmbed(input: {
  fields: ContactFields
  locale: ContactLocale
}): Promise<{ ok: true } | { ok: false }> {
  const webhook = getContactDiscordWebhook()
  if (!webhook) return { ok: false }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        embeds: [
          {
            title: "New contact",
            description: input.fields.message,
            fields: [
              { name: "Name", value: input.fields.name, inline: true },
              { name: "Email", value: input.fields.email, inline: true },
              {
                name: "Intent",
                value: CONTACT_INTENT_LABELS[input.fields.intent],
                inline: true,
              },
              { name: "Locale", value: input.locale, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })

    if (!response.ok) return { ok: false }
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
