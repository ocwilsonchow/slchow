import { describe, expect, it } from "vitest"
import { buildContactDiscordEmbed } from "./discord-embed"

describe("buildContactDiscordEmbed", () => {
  it("includes the stage in the title and fields", () => {
    const embed = buildContactDiscordEmbed({
      fields: {
        name: "Jane Doe",
        email: "you@example.com",
        intent: "hiring",
        message: "A short note about the role, project, or idea.",
      },
      locale: "en",
      stage: "dev",
      timestamp: "2026-08-16T00:00:00.000Z",
    })

    expect(embed.title).toBe("New contact · dev")
    expect(embed.fields).toContainEqual({
      name: "Stage",
      value: "dev",
      inline: true,
    })
  })
})
