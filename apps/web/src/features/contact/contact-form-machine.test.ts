import { describe, expect, it, vi } from "vitest"
import { createActor, fromPromise, waitFor } from "xstate"
import {
  contactFormMachine,
  getContactStepIndex,
  getVisibleContactStep,
  submitErrorFromUnknown,
} from "./contact-form-machine"
import type { ContactFields, ContactFormValues } from "./schema"

const validValues: ContactFormValues = {
  name: "Jane Doe",
  email: "you@example.com",
  intent: "hiring",
  message: "A short note about the role, project, or idea.",
}

function startContactActor(
  deliver: (fields: ContactFields) => Promise<void> = async () => {}
) {
  const machine = contactFormMachine.provide({
    actors: {
      deliverContact: fromPromise<void, ContactFields>(async ({ input }) => {
        await deliver(input)
      }),
    },
  })

  const actor = createActor(machine)
  actor.start()
  return actor
}

/** Advance from the initial `name` state. */
function walkFromName(
  actor: ReturnType<typeof startContactActor>,
  step: "email" | "intent" | "message" | "review",
  values: ContactFormValues = validValues
) {
  const path = ["email", "intent", "message", "review"] as const
  for (const next of path) {
    actor.send({ type: "NEXT", values })
    if (next === step) return
  }
}

describe("submitErrorFromUnknown", () => {
  it("maps a turnstile source field to turnstile", () => {
    expect(submitErrorFromUnknown({ source: "turnstile" })).toBe("turnstile")
  })

  it("maps errors whose message starts with turnstile", () => {
    expect(submitErrorFromUnknown(new Error("turnstile-timeout"))).toBe(
      "turnstile"
    )
  })

  it("maps everything else to submit", () => {
    expect(submitErrorFromUnknown(new Error("network"))).toBe("submit")
    expect(submitErrorFromUnknown("blocked")).toBe("submit")
    expect(submitErrorFromUnknown(null)).toBe("submit")
  })
})

describe("getContactStepIndex", () => {
  it("returns the wizard order", () => {
    expect(getContactStepIndex("name")).toBe(0)
    expect(getContactStepIndex("email")).toBe(1)
    expect(getContactStepIndex("intent")).toBe(2)
    expect(getContactStepIndex("message")).toBe(3)
    expect(getContactStepIndex("review")).toBe(4)
  })
})

describe("contactFormMachine", () => {
  it("walks name → email → intent → message → review → success", async () => {
    const deliver = vi.fn(async () => {})
    const actor = startContactActor(deliver)

    expect(actor.getSnapshot().matches("name")).toBe(true)
    expect(actor.getSnapshot().hasTag("step")).toBe(true)
    expect(getVisibleContactStep(actor.getSnapshot())).toBe("name")

    actor.send({ type: "NEXT", values: validValues })
    expect(actor.getSnapshot().matches("email")).toBe(true)
    expect(getVisibleContactStep(actor.getSnapshot())).toBe("email")

    actor.send({ type: "NEXT", values: validValues })
    expect(actor.getSnapshot().matches("intent")).toBe(true)
    expect(getVisibleContactStep(actor.getSnapshot())).toBe("intent")

    actor.send({ type: "NEXT", values: validValues })
    expect(actor.getSnapshot().matches("message")).toBe(true)
    expect(getVisibleContactStep(actor.getSnapshot())).toBe("message")

    actor.send({ type: "NEXT", values: validValues })
    expect(actor.getSnapshot().matches("review")).toBe(true)
    expect(getVisibleContactStep(actor.getSnapshot())).toBe("review")

    actor.send({ type: "SUBMIT", values: validValues })
    expect(actor.getSnapshot().matches("submitting")).toBe(true)
    expect(actor.getSnapshot().hasTag("busy")).toBe(true)
    expect(getVisibleContactStep(actor.getSnapshot())).toBe("review")

    await waitFor(actor, (snapshot) => snapshot.matches("success"))
    expect(actor.getSnapshot().hasTag("complete")).toBe(true)
    expect(deliver).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "you@example.com",
      intent: "hiring",
      message: "A short note about the role, project, or idea.",
    })
  })

  it("stays on name and assigns nameMin when NEXT is invalid", () => {
    const actor = startContactActor()
    actor.send({ type: "NEXT", values: { ...validValues, name: "A" } })

    expect(actor.getSnapshot().matches("name")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBe("nameMin")
  })

  it("stays on email and assigns emailInvalid when NEXT is invalid", () => {
    const actor = startContactActor()
    walkFromName(actor, "email")
    actor.send({
      type: "NEXT",
      values: { ...validValues, email: "not-an-email" },
    })

    expect(actor.getSnapshot().matches("email")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBe("emailInvalid")
  })

  it("stays on intent and assigns intentRequired when NEXT is invalid", () => {
    const actor = startContactActor()
    walkFromName(actor, "intent")
    actor.send({
      type: "NEXT",
      values: { ...validValues, intent: undefined },
    })

    expect(actor.getSnapshot().matches("intent")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBe("intentRequired")
  })

  it("stays on message and assigns messageMin when NEXT is invalid", () => {
    const actor = startContactActor()
    walkFromName(actor, "message")
    actor.send({
      type: "NEXT",
      values: { ...validValues, message: "too short" },
    })

    expect(actor.getSnapshot().matches("message")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBe("messageMin")
  })

  it("stays on review and assigns messageMin when SUBMIT is invalid", () => {
    const actor = startContactActor()
    walkFromName(actor, "review")
    actor.send({
      type: "SUBMIT",
      values: { ...validValues, message: "too short" },
    })

    expect(actor.getSnapshot().matches("review")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBe("messageMin")
  })

  it("goes BACK from review to message without validating", () => {
    const actor = startContactActor()
    walkFromName(actor, "review")
    actor.send({ type: "BACK" })

    expect(actor.getSnapshot().matches("message")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBeUndefined()
    expect(actor.getSnapshot().context.submitError).toBeUndefined()
  })

  it("goes BACK from email to name without validating", () => {
    const actor = startContactActor()
    walkFromName(actor, "email")
    actor.send({ type: "BACK" })

    expect(actor.getSnapshot().matches("name")).toBe(true)
    expect(actor.getSnapshot().context.stepError).toBeUndefined()
    expect(actor.getSnapshot().context.submitError).toBeUndefined()
  })

  it("clears errors on EDIT", () => {
    const actor = startContactActor()
    actor.send({ type: "NEXT", values: { ...validValues, name: "" } })
    expect(actor.getSnapshot().context.stepError).toBe("nameMin")

    actor.send({ type: "EDIT" })
    expect(actor.getSnapshot().context.stepError).toBeUndefined()
    expect(actor.getSnapshot().context.submitError).toBeUndefined()
    expect(actor.getSnapshot().matches("name")).toBe(true)
  })

  it("returns to review with submitError turnstile when delivery fails that way", async () => {
    const actor = startContactActor(async () => {
      throw Object.assign(new Error("blocked"), { source: "turnstile" })
    })
    walkFromName(actor, "review")
    actor.send({ type: "SUBMIT", values: validValues })

    await waitFor(actor, (snapshot) => snapshot.matches("review"))
    expect(actor.getSnapshot().context.submitError).toBe("turnstile")
    expect(actor.getSnapshot().context.stepError).toBeUndefined()
  })

  it("returns to review with submitError submit when delivery fails otherwise", async () => {
    const actor = startContactActor(async () => {
      throw new Error("network")
    })
    walkFromName(actor, "review")
    actor.send({ type: "SUBMIT", values: validValues })

    await waitFor(actor, (snapshot) => snapshot.matches("review"))
    expect(actor.getSnapshot().context.submitError).toBe("submit")
    expect(actor.getSnapshot().context.stepError).toBeUndefined()
  })

  it("passes trimmed fields to deliverContact", async () => {
    const deliver = vi.fn(async () => {})
    const actor = startContactActor(deliver)
    const padded: ContactFormValues = {
      ...validValues,
      name: "  Jane Doe  ",
      message: "  A short note about the role, project, or idea.  ",
    }

    walkFromName(actor, "review", padded)
    actor.send({ type: "SUBMIT", values: padded })
    await waitFor(actor, (snapshot) => snapshot.matches("success"))

    expect(deliver).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "you@example.com",
      intent: "hiring",
      message: "A short note about the role, project, or idea.",
    })
  })
})
