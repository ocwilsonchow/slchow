import { z } from "zod"

export const CONTACT_INTENTS = [
  "hiring",
  "project",
  "collaboration",
  "other",
] as const

export type ContactIntent = (typeof CONTACT_INTENTS)[number]

export const CONTACT_INTENT_LABELS: Record<ContactIntent, string> = {
  hiring: "Hiring",
  project: "Project",
  collaboration: "Collaboration",
  other: "Other",
}

export const CONTACT_STEPS = [
  "name",
  "email",
  "intent",
  "message",
  "review",
] as const

export type ContactStep = (typeof CONTACT_STEPS)[number]
export type ContactFieldStep = Exclude<ContactStep, "review">

export const CONTACT_FIELD_STEPS = CONTACT_STEPS.filter(
  (step): step is ContactFieldStep => step !== "review"
)

export const CONTACT_MESSAGE_MIN_LENGTH = 20
export const CONTACT_MESSAGE_MAX_LENGTH = 500

export const contactFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "nameMin" })
    .max(80, { error: "nameMax" }),
  email: z.email({ error: "emailInvalid" }),
  intent: z.enum(CONTACT_INTENTS, { error: "intentRequired" }),
  message: z
    .string()
    .trim()
    .min(CONTACT_MESSAGE_MIN_LENGTH, { error: "messageMin" })
    .max(CONTACT_MESSAGE_MAX_LENGTH, { error: "messageMax" }),
})

export type ContactFields = z.infer<typeof contactFieldsSchema>

export type ContactFormValues = {
  name: string
  email: string
  intent: ContactIntent | undefined
  message: string
}

export const contactFormDefaults: ContactFormValues = {
  name: "",
  email: "",
  intent: CONTACT_INTENTS[0],
  message: "",
}

export const contactStepSchemas = {
  name: contactFieldsSchema.pick({ name: true }),
  email: contactFieldsSchema.pick({ email: true }),
  intent: contactFieldsSchema.pick({ intent: true }),
  message: contactFieldsSchema.pick({ message: true }),
} as const

export const contactLocales = ["en", "hk", "cn"] as const

export type ContactLocale = (typeof contactLocales)[number]

export const TURNSTILE_TOKEN_MAX_LENGTH = 2048

export const contactRequestSchema = contactFieldsSchema.extend({
  locale: z.enum(contactLocales),
  turnstileToken: z.string().max(TURNSTILE_TOKEN_MAX_LENGTH),
})

export type ContactRequest = z.infer<typeof contactRequestSchema>

export type ContactApiSource = "validation" | "turnstile" | "discord" | "origin"

export type ContactApiSuccess = { ok: true }

export type ContactApiFailure = {
  ok: false
  errors: unknown
  source: ContactApiSource
}

export type ContactApiResponse = ContactApiSuccess | ContactApiFailure

export function firstIssueCode(error: z.ZodError): string {
  return error.issues[0]?.message ?? "invalid"
}

export function isContactApiSuccess(
  value: unknown
): value is ContactApiSuccess {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    value.ok === true
  )
}

export function isContactApiFailure(
  value: unknown
): value is ContactApiFailure {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    value.ok === false &&
    "source" in value
  )
}
