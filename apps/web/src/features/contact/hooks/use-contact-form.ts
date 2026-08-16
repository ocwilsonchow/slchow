"use client"

import { useForm } from "@tanstack/react-form"
import { useMachine } from "@xstate/react"
import { useLocale, useTranslations } from "next-intl"
import { type FormEvent, useCallback, useMemo, useRef } from "react"
import { fromPromise } from "xstate"
import {
  contactFormMachine,
  getContactStepIndex,
  getVisibleContactStep,
} from "../contact-form-machine"
import {
  type ContactFields,
  type ContactLocale,
  contactFormDefaults,
} from "../schema"
import { useContactMutation } from "./use-contact-mutation"
import { useTurnstile } from "./use-turnstile"

export type ContactFocusable =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLButtonElement

const FIELD_ERROR_KEYS = [
  "nameMin",
  "nameMax",
  "emailInvalid",
  "intentRequired",
  "messageMin",
  "messageMax",
] as const

type FieldErrorKey = (typeof FIELD_ERROR_KEYS)[number]

const FIELD_ERROR_KEY_SET: ReadonlySet<string> = new Set(FIELD_ERROR_KEYS)

const SUBMIT_MIN_DELAY_MS = 1000

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function translateFieldError(
  t: ReturnType<typeof useTranslations<"contact">>,
  code: string
) {
  const key: FieldErrorKey | "invalid" = FIELD_ERROR_KEY_SET.has(code)
    ? (code as FieldErrorKey)
    : "invalid"
  return t(`errors.${key}`)
}

/**
 * Wires Turnstile, the contact mutation, and TanStack Form to the XState chart.
 * The form sends events; it does not branch on step indexes itself.
 */
export function useContactForm(requireTurnstile: boolean) {
  const t = useTranslations("contact")
  const locale = useLocale() as ContactLocale
  const mutation = useContactMutation()
  const { containerRef, renderWidget, execute, reset } =
    useTurnstile(requireTurnstile)

  const deliverRef = useRef<(fields: ContactFields) => Promise<void>>(
    async () => {}
  )
  deliverRef.current = async (fields) => {
    const minDelay = wait(SUBMIT_MIN_DELAY_MS)
    try {
      const turnstileToken = await execute()
      await mutation.mutateAsync({
        ...fields,
        locale,
        turnstileToken,
      })
    } finally {
      await minDelay
      reset()
    }
  }

  // Memoize provide so useMachine keeps one actor. deliverContact reads a ref
  // so the invoked actor always sees the latest execute/mutate closures.
  const formMachine = useMemo(
    () =>
      contactFormMachine.provide({
        actors: {
          deliverContact: fromPromise<void, ContactFields>(
            async ({ input }) => {
              await deliverRef.current(input)
            }
          ),
        },
      }),
    []
  )

  const [snapshot, send] = useMachine(formMachine)
  const form = useForm({
    defaultValues: contactFormDefaults,
  })

  const step = getVisibleContactStep(snapshot)
  const stepIndex = getContactStepIndex(step)
  const isLastStep = step === "review"
  const isBusy = snapshot.hasTag("busy")
  const canGoBack = snapshot.hasTag("step") && !snapshot.matches("name")
  const errorMessage = snapshot.context.stepError
    ? translateFieldError(t, snapshot.context.stepError)
    : snapshot.context.submitError === "turnstile"
      ? t("errors.turnstile")
      : snapshot.context.submitError === "submit"
        ? t("errors.submit")
        : undefined

  const focusOnMount = useCallback((node: ContactFocusable | null) => {
    node?.focus()
  }, [])

  function goNext() {
    send({ type: "NEXT", values: form.state.values })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (isBusy) return

    if (snapshot.matches("review")) {
      send({ type: "SUBMIT", values: form.state.values })
      return
    }

    goNext()
  }

  return {
    snapshot,
    send,
    form,
    step,
    stepIndex,
    isBusy,
    isLastStep,
    canGoBack,
    errorMessage,
    containerRef,
    renderWidget,
    focusOnMount,
    submit,
    goNext,
  }
}
