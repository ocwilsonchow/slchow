/*
 * Contact form flow: name → email → intent → message → submitting → success.
 * TanStack Form owns values; this machine owns step, validation gates, and delivery.
 *
 * NEXT/SUBMIT carry TanStack values for guards. EDIT clears errors. BACK never
 * validates. Invalid NEXT/SUBMIT stay on the same state and assign*Error.
 * `submitting` invokes `deliverContact`; `success` is final. Tags (`step` /
 * `busy` / `complete`) are the UI subscription surface.
 */
import { assign, fromPromise, type SnapshotFrom, setup } from "xstate"
import {
  CONTACT_STEPS,
  type ContactFields,
  type ContactFormValues,
  type ContactStep,
  contactFieldsSchema,
  contactStepSchemas,
  firstIssueCode,
} from "./schema"

export type ContactSubmitError = "turnstile" | "submit"

export type ContactFormEvent =
  | { type: "NEXT"; values: ContactFormValues } // values for the step guard
  | { type: "BACK" } // never validates
  | { type: "EDIT" } // clears errors
  | { type: "SUBMIT"; values: ContactFormValues } // values for the full-form guard

type ContactFormContext = {
  stepError?: string
  submitError?: ContactSubmitError
}

function isValuesEvent(
  event: ContactFormEvent
): event is Extract<ContactFormEvent, { values: ContactFormValues }> {
  return event.type === "NEXT" || event.type === "SUBMIT"
}

function stepIsValid(step: ContactStep, event: ContactFormEvent) {
  if (!isValuesEvent(event)) return false
  return contactStepSchemas[step].safeParse(event.values).success
}

function stepErrorFromEvent(step: ContactStep, event: ContactFormEvent) {
  if (!isValuesEvent(event)) return undefined
  const result = contactStepSchemas[step].safeParse(event.values)
  return result.success ? undefined : firstIssueCode(result.error)
}

function formIsValid(event: ContactFormEvent) {
  if (event.type !== "SUBMIT") return false
  return contactFieldsSchema.safeParse(event.values).success
}

function formErrorFromEvent(event: ContactFormEvent) {
  if (event.type !== "SUBMIT") return undefined
  const result = contactFieldsSchema.safeParse(event.values)
  return result.success ? undefined : firstIssueCode(result.error)
}

export function submitErrorFromUnknown(error: unknown): ContactSubmitError {
  if (
    typeof error === "object" &&
    error !== null &&
    "source" in error &&
    error.source === "turnstile"
  ) {
    return "turnstile"
  }

  if (error instanceof Error && error.message.startsWith("turnstile")) {
    return "turnstile"
  }

  return "submit"
}

const deliverContact = fromPromise<void, ContactFields>(async () => {
  throw new Error("deliverContact actor must be provided")
})

export const contactFormMachine = setup({
  types: {
    context: {} as ContactFormContext,
    events: {} as ContactFormEvent,
    tags: {} as "step" | "busy" | "complete", // UI subscription surface
  },
  actors: {
    deliverContact,
  },
  guards: {
    nameValid: ({ event }) => stepIsValid("name", event),
    emailValid: ({ event }) => stepIsValid("email", event),
    intentValid: ({ event }) => stepIsValid("intent", event),
    formValid: ({ event }) => formIsValid(event),
  },
  actions: {
    clearErrors: assign({
      stepError: undefined,
      submitError: undefined,
    }),
    assignNameError: assign({
      stepError: ({ event }) => stepErrorFromEvent("name", event),
      submitError: undefined,
    }),
    assignEmailError: assign({
      stepError: ({ event }) => stepErrorFromEvent("email", event),
      submitError: undefined,
    }),
    assignIntentError: assign({
      stepError: ({ event }) => stepErrorFromEvent("intent", event),
      submitError: undefined,
    }),
    assignFormError: assign({
      stepError: ({ event }) => formErrorFromEvent(event),
      submitError: undefined,
    }),
    assignSubmitError: assign({
      stepError: undefined,
      submitError: ({ event }) =>
        submitErrorFromUnknown("error" in event ? event.error : undefined),
    }),
  },
}).createMachine({
  id: "contactForm",
  initial: "name",
  context: {},
  states: {
    name: {
      tags: ["step"],
      on: {
        EDIT: { actions: "clearErrors" },
        NEXT: [
          { guard: "nameValid", target: "email", actions: "clearErrors" },
          { actions: "assignNameError" }, // stay; assign field error
        ],
      },
    },
    email: {
      tags: ["step"],
      on: {
        EDIT: { actions: "clearErrors" },
        BACK: { target: "name", actions: "clearErrors" },
        NEXT: [
          { guard: "emailValid", target: "intent", actions: "clearErrors" },
          { actions: "assignEmailError" }, // stay; assign field error
        ],
      },
    },
    intent: {
      tags: ["step"],
      on: {
        EDIT: { actions: "clearErrors" },
        BACK: { target: "email", actions: "clearErrors" },
        NEXT: [
          { guard: "intentValid", target: "message", actions: "clearErrors" },
          { actions: "assignIntentError" }, // stay; assign field error
        ],
      },
    },
    message: {
      tags: ["step"],
      on: {
        EDIT: { actions: "clearErrors" },
        BACK: { target: "intent", actions: "clearErrors" },
        SUBMIT: [
          {
            guard: "formValid",
            target: "submitting",
            actions: "clearErrors",
          },
          { actions: "assignFormError" }, // stay; assign field error
        ],
      },
    },
    submitting: {
      tags: ["busy"],
      invoke: {
        src: "deliverContact", // provided at runtime
        input: ({ event }) => {
          if (event.type !== "SUBMIT") {
            throw new Error("deliverContact requires SUBMIT")
          }
          return contactFieldsSchema.parse(event.values)
        },
        onDone: "success",
        onError: {
          target: "message",
          actions: "assignSubmitError",
        },
      },
    },
    success: {
      tags: ["complete"],
      type: "final", // terminal thanks state
    },
  },
})

export type ContactFormSnapshot = SnapshotFrom<typeof contactFormMachine>

export function getVisibleContactStep(
  snapshot: ContactFormSnapshot
): ContactStep {
  if (snapshot.matches("email")) return "email"
  if (snapshot.matches("intent")) return "intent"
  if (snapshot.matches("message") || snapshot.matches("submitting")) {
    return "message"
  }
  return "name"
}

export function getContactStepIndex(step: ContactStep) {
  return CONTACT_STEPS.indexOf(step)
}
