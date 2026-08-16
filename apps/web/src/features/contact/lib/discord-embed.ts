import {
  CONTACT_INTENT_LABELS,
  type ContactFields,
  type ContactLocale,
} from "../schema"

export function buildContactDiscordEmbed(input: {
  fields: ContactFields
  locale: ContactLocale
  stage: string
  timestamp?: string
}) {
  return {
    title: `New contact · ${input.stage}`,
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
      { name: "Stage", value: input.stage, inline: true },
    ],
    timestamp: input.timestamp ?? new Date().toISOString(),
  }
}
