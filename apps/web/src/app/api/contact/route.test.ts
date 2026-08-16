import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  isSstProduction: vi.fn(),
  shouldSendContactDiscord: vi.fn(),
  verifyTurnstileToken: vi.fn(),
  getClientIp: vi.fn(),
  sendContactDiscordEmbed: vi.fn(),
}))

vi.mock("@/features/contact/lib/stage", () => ({
  isSstProduction: mocks.isSstProduction,
  shouldSendContactDiscord: mocks.shouldSendContactDiscord,
}))

vi.mock("@/features/contact/lib/turnstile", () => ({
  verifyTurnstileToken: mocks.verifyTurnstileToken,
  getClientIp: mocks.getClientIp,
}))

vi.mock("@/features/contact/lib/discord", () => ({
  sendContactDiscordEmbed: mocks.sendContactDiscordEmbed,
}))

import { POST } from "./route"

const siteUrl = "https://oc.example"
const validBody = {
  name: "Jane Doe",
  email: "you@example.com",
  intent: "hiring",
  message: "A short note about the role, project, or idea.",
  locale: "en",
  turnstileToken: "token",
}

function contactRequest(init?: {
  body?: BodyInit | null
  origin?: string
  json?: unknown
}) {
  const headers = new Headers({ "content-type": "application/json" })
  if (init?.origin) {
    headers.set("origin", init.origin)
  }

  return new Request("http://127.0.0.1/api/contact", {
    method: "POST",
    headers,
    body:
      init?.body !== undefined
        ? init.body
        : JSON.stringify(init?.json ?? validBody),
  })
}

async function readJson(response: Response) {
  return {
    status: response.status,
    body: await response.json(),
  }
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl
    mocks.isSstProduction.mockReturnValue(false)
    mocks.shouldSendContactDiscord.mockReturnValue(false)
    mocks.getClientIp.mockReturnValue("1.2.3.4")
    mocks.verifyTurnstileToken.mockResolvedValue({ ok: true })
    mocks.sendContactDiscordEmbed.mockResolvedValue({ ok: true })
    vi.spyOn(console, "info").mockImplementation(() => {})
  })

  it("accepts a valid body on local without Turnstile or Discord", async () => {
    const result = await readJson(await POST(contactRequest()))

    expect(result).toEqual({ status: 200, body: { ok: true } })
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled()
    expect(mocks.sendContactDiscordEmbed).not.toHaveBeenCalled()
  })

  it("sends Discord on the dev stage without Turnstile", async () => {
    mocks.shouldSendContactDiscord.mockReturnValue(true)

    const result = await readJson(await POST(contactRequest()))

    expect(result).toEqual({ status: 200, body: { ok: true } })
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled()
    expect(mocks.sendContactDiscordEmbed).toHaveBeenCalledWith({
      fields: {
        name: "Jane Doe",
        email: "you@example.com",
        intent: "hiring",
        message: "A short note about the role, project, or idea.",
      },
      locale: "en",
    })
  })

  it("returns 502 when Discord delivery fails on the dev stage", async () => {
    mocks.shouldSendContactDiscord.mockReturnValue(true)
    mocks.sendContactDiscordEmbed.mockResolvedValue({ ok: false })

    const result = await readJson(await POST(contactRequest()))

    expect(result.status).toBe(502)
    expect(result.body).toMatchObject({ ok: false, source: "discord" })
  })

  it("rejects a missing origin in production", async () => {
    mocks.isSstProduction.mockReturnValue(true)

    const result = await readJson(await POST(contactRequest()))

    expect(result.status).toBe(403)
    expect(result.body).toMatchObject({ ok: false, source: "origin" })
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled()
  })

  it("rejects a foreign origin in production", async () => {
    mocks.isSstProduction.mockReturnValue(true)

    const result = await readJson(
      await POST(contactRequest({ origin: "https://evil.example" }))
    )

    expect(result.status).toBe(403)
    expect(result.body).toMatchObject({ ok: false, source: "origin" })
  })

  it("rejects invalid JSON", async () => {
    const result = await readJson(
      await POST(contactRequest({ body: "not-json" }))
    )

    expect(result.status).toBe(400)
    expect(result.body).toMatchObject({ ok: false, source: "validation" })
  })

  it("rejects a Zod-invalid body", async () => {
    const result = await readJson(
      await POST(contactRequest({ json: { ...validBody, email: "nope" } }))
    )

    expect(result.status).toBe(422)
    expect(result.body).toMatchObject({ ok: false, source: "validation" })
  })

  it("returns 500 when Turnstile is unconfigured", async () => {
    mocks.isSstProduction.mockReturnValue(true)
    mocks.verifyTurnstileToken.mockResolvedValue({
      ok: false,
      reason: "config",
    })

    const result = await readJson(
      await POST(contactRequest({ origin: siteUrl }))
    )

    expect(result.status).toBe(500)
    expect(result.body).toMatchObject({ ok: false, source: "turnstile" })
    expect(mocks.sendContactDiscordEmbed).not.toHaveBeenCalled()
  })

  it("returns 403 when Turnstile verification fails", async () => {
    mocks.isSstProduction.mockReturnValue(true)
    mocks.verifyTurnstileToken.mockResolvedValue({
      ok: false,
      reason: "verify",
    })

    const result = await readJson(
      await POST(contactRequest({ origin: siteUrl }))
    )

    expect(result.status).toBe(403)
    expect(result.body).toMatchObject({ ok: false, source: "turnstile" })
    expect(mocks.verifyTurnstileToken).toHaveBeenCalledWith({
      token: "token",
      remoteip: "1.2.3.4",
    })
    expect(mocks.sendContactDiscordEmbed).not.toHaveBeenCalled()
  })

  it("returns 502 when Discord delivery fails", async () => {
    mocks.isSstProduction.mockReturnValue(true)
    mocks.shouldSendContactDiscord.mockReturnValue(true)
    mocks.sendContactDiscordEmbed.mockResolvedValue({ ok: false })

    const result = await readJson(
      await POST(contactRequest({ origin: siteUrl }))
    )

    expect(result.status).toBe(502)
    expect(result.body).toMatchObject({ ok: false, source: "discord" })
  })

  it("accepts a valid production submission", async () => {
    mocks.isSstProduction.mockReturnValue(true)
    mocks.shouldSendContactDiscord.mockReturnValue(true)

    const result = await readJson(
      await POST(contactRequest({ origin: siteUrl }))
    )

    expect(result).toEqual({ status: 200, body: { ok: true } })
    expect(mocks.sendContactDiscordEmbed).toHaveBeenCalledWith({
      fields: {
        name: "Jane Doe",
        email: "you@example.com",
        intent: "hiring",
        message: "A short note about the role, project, or idea.",
      },
      locale: "en",
    })
  })
})
