import "server-only"

import { Resource } from "sst"
import type { ContactFields, ContactLocale } from "../schema"
import { buildContactDiscordEmbed } from "./discord-embed"
import { getSstStage } from "./stage"

export function getContactDiscordWebhook(): string | undefined {
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
          buildContactDiscordEmbed({
            ...input,
            stage: getSstStage(),
          }),
        ],
      }),
    })

    if (!response.ok) return { ok: false }
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
