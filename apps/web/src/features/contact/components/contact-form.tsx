"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Script from "next/script"
import { useTranslations } from "next-intl"
import { useContactForm } from "../hooks/use-contact-form"
import { CONTACT_STEPS, type ContactStep } from "../schema"
import { ContactFormActions } from "./contact-form-actions"
import { ContactIntentField } from "./contact-intent-field"
import { ContactProgress } from "./contact-progress"
import { ContactReviewFields } from "./contact-review-fields"
import { ContactTextField } from "./contact-text-field"

const HEADING_ID = "contact-step-heading"
const ERROR_ID = "contact-step-error"

function stepHeading(
  t: ReturnType<typeof useTranslations<"contact">>,
  step: ContactStep
) {
  switch (step) {
    case "name":
      return t("questions.name")
    case "email":
      return t("questions.email")
    case "intent":
      return t("questions.intent")
    case "message":
      return t("questions.message")
    case "review":
      return t("questions.review")
  }
}

type Props = {
  requireTurnstile: boolean
}

export function ContactForm({ requireTurnstile }: Props) {
  const t = useTranslations("contact")
  const shouldReduceMotion = useReducedMotion()
  const {
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
  } = useContactForm(requireTurnstile)

  if (snapshot.hasTag("complete")) {
    return (
      <div className="space-y-2">
        <p className="font-semibold tracking-tight text-content-ink">
          😊 {t("thanks")}
        </p>
      </div>
    )
  }

  const describedBy = errorMessage ? ERROR_ID : undefined
  const invalid = Boolean(errorMessage)

  return (
    <>
      {requireTurnstile ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderWidget}
        />
      ) : null}

      <form
        noValidate
        className="flex max-w-md flex-col gap-6"
        onSubmit={submit}
        aria-labelledby={HEADING_ID}
      >
        <ContactProgress
          current={stepIndex + 1}
          total={CONTACT_STEPS.length}
          label={t("progressSr", {
            current: stepIndex + 1,
            total: CONTACT_STEPS.length,
          })}
          reduceMotion={Boolean(shouldReduceMotion)}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h2
              id={HEADING_ID}
              className="font-semibold tracking-tight text-content-ink"
            >
              {stepHeading(t, step)}
            </h2>

            {step === "name" ? (
              <ContactTextField
                form={form}
                name="name"
                send={send}
                focusOnMount={focusOnMount}
                invalid={invalid}
                describedBy={describedBy}
                placeholder={t("placeholders.name")}
                autoComplete="name"
                autoCapitalize="words"
              />
            ) : null}

            {step === "email" ? (
              <ContactTextField
                form={form}
                name="email"
                send={send}
                focusOnMount={focusOnMount}
                invalid={invalid}
                describedBy={describedBy}
                placeholder={t("placeholders.email")}
                type="email"
                autoComplete="email"
                inputMode="email"
              />
            ) : null}

            {step === "intent" ? (
              <ContactIntentField
                form={form}
                send={send}
                goNext={goNext}
                focusOnMount={focusOnMount}
                headingId={HEADING_ID}
                invalid={invalid}
                describedBy={describedBy}
              />
            ) : null}

            {step === "message" ? (
              <ContactTextField
                form={form}
                name="message"
                send={send}
                focusOnMount={focusOnMount}
                invalid={invalid}
                describedBy={describedBy}
                placeholder={t("placeholders.message")}
                multiline
              />
            ) : null}

            {step === "review" ? (
              <ContactReviewFields values={form.state.values} />
            ) : null}

            {errorMessage ? (
              <p
                id={ERROR_ID}
                role="alert"
                className="text-xs text-content-error"
              >
                {errorMessage}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <ContactFormActions
          canGoBack={canGoBack}
          isBusy={isBusy}
          isLastStep={isLastStep}
          hint={
            step === "review"
              ? "submit"
              : step === "message"
                ? "newline"
                : "proceed"
          }
          onBack={() => send({ type: "BACK" })}
          focusSubmit={isLastStep ? focusOnMount : undefined}
        />

        <div ref={containerRef} />
      </form>
    </>
  )
}
