import { describe, expect, it } from "vitest"
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  contactFieldsSchema,
  contactFormDefaults,
  contactRequestSchema,
  firstIssueCode,
  isContactApiFailure,
  isContactApiSuccess,
  TURNSTILE_TOKEN_MAX_LENGTH,
} from "./schema"

const validFields = {
  name: "Jane Doe",
  email: "you@example.com",
  intent: "hiring" as const,
  message: "A short note about the role, project, or idea.",
}

describe("contactFieldsSchema", () => {
  it.each([
    {
      name: "accepts a complete payload",
      input: validFields,
      success: true,
    },
    {
      name: "trims name and message",
      input: {
        ...validFields,
        name: "  Jane Doe  ",
        message: "  A short note about the role, project, or idea.  ",
      },
      success: true,
      parsed: validFields,
    },
    {
      name: "rejects a short name",
      input: { ...validFields, name: "A" },
      success: false,
      code: "nameMin",
    },
    {
      name: "rejects a long name",
      input: { ...validFields, name: "A".repeat(81) },
      success: false,
      code: "nameMax",
    },
    {
      name: "rejects an invalid email",
      input: { ...validFields, email: "not-an-email" },
      success: false,
      code: "emailInvalid",
    },
    {
      name: "rejects a missing intent",
      input: { ...validFields, intent: undefined },
      success: false,
      code: "intentRequired",
    },
    {
      name: "rejects an unknown intent",
      input: { ...validFields, intent: "spam" },
      success: false,
      code: "intentRequired",
    },
    {
      name: "rejects a short message",
      input: { ...validFields, message: "too short" },
      success: false,
      code: "messageMin",
    },
    {
      name: "accepts a 500-character message",
      input: {
        ...validFields,
        message: "A".repeat(CONTACT_MESSAGE_MAX_LENGTH),
      },
      success: true,
    },
    {
      name: "rejects a 501-character message",
      input: {
        ...validFields,
        message: "A".repeat(CONTACT_MESSAGE_MAX_LENGTH + 1),
      },
      success: false,
      code: "messageMax",
    },
  ])("$name", ({ input, success, code, parsed }) => {
    const result = contactFieldsSchema.safeParse(input)

    expect(result.success).toBe(success)
    if (success && parsed) {
      expect(result.success && result.data).toEqual(parsed)
    }
    if (!success && code) {
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(firstIssueCode(result.error)).toBe(code)
      }
    }
  })
})

describe("contactRequestSchema", () => {
  const validRequest = {
    ...validFields,
    locale: "en" as const,
    turnstileToken: "token",
  }

  it("accepts a request envelope", () => {
    expect(contactRequestSchema.safeParse(validRequest).success).toBe(true)
  })

  it.each(["en", "hk", "cn"] as const)("accepts locale %s", (locale) => {
    expect(
      contactRequestSchema.safeParse({ ...validRequest, locale }).success
    ).toBe(true)
  })

  it("rejects an unknown locale", () => {
    const result = contactRequestSchema.safeParse({
      ...validRequest,
      locale: "ja",
    })
    expect(result.success).toBe(false)
  })

  it("rejects a turnstile token over the max length", () => {
    const result = contactRequestSchema.safeParse({
      ...validRequest,
      turnstileToken: "x".repeat(TURNSTILE_TOKEN_MAX_LENGTH + 1),
    })
    expect(result.success).toBe(false)
  })
})

describe("contactFormDefaults", () => {
  it("starts empty except intent, so the first step is invalid until typed", () => {
    expect(contactFormDefaults).toEqual({
      name: "",
      email: "",
      intent: "hiring",
      message: "",
    })
    expect(contactFieldsSchema.safeParse(contactFormDefaults).success).toBe(
      false
    )
  })
})

describe("API response guards", () => {
  it("recognizes a success payload", () => {
    expect(isContactApiSuccess({ ok: true })).toBe(true)
    expect(isContactApiSuccess({ ok: false, source: "validation" })).toBe(false)
    expect(isContactApiSuccess(null)).toBe(false)
  })

  it("recognizes a failure payload", () => {
    expect(
      isContactApiFailure({ ok: false, source: "turnstile", errors: [] })
    ).toBe(true)
    expect(isContactApiFailure({ ok: true })).toBe(false)
    expect(isContactApiFailure({ ok: false })).toBe(false)
  })
})

describe("firstIssueCode", () => {
  it("returns the first Zod issue message", () => {
    const result = contactFieldsSchema.safeParse({
      ...validFields,
      name: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(firstIssueCode(result.error)).toBe("nameMin")
    }
  })
})
