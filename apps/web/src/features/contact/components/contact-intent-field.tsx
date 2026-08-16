"use client"

import { cn } from "@repo/ds"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import type { KeyboardEvent } from "react"
import type { ContactFormEvent } from "../contact-form-machine"
import type { useContactForm } from "../hooks/use-contact-form"
import { CONTACT_INTENTS } from "../schema"

type ContactFormApi = ReturnType<typeof useContactForm>["form"]

type Props = {
  form: ContactFormApi
  send: (event: ContactFormEvent) => void
  goNext: () => void
  focusOnMount: ReturnType<typeof useContactForm>["focusOnMount"]
  headingId: string
  invalid: boolean
  describedBy?: string
}

export function ContactIntentField({
  form,
  send,
  goNext,
  focusOnMount,
  headingId,
  invalid,
  describedBy,
}: Props) {
  const t = useTranslations("contact")

  function handleKeyDown(event: KeyboardEvent<HTMLFieldSetElement>) {
    if (event.key !== "Enter") return
    event.preventDefault()
    goNext()
  }

  return (
    <form.Field name="intent">
      {(field) => (
        <fieldset
          aria-labelledby={headingId}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="m-0 flex flex-col border-0 p-0 gap-3"
          onKeyDown={handleKeyDown}
        >
          {CONTACT_INTENTS.map((intent) => {
            const selected = field.state.value === intent
            const shouldFocus = selected
            return (
              <motion.button
                key={intent}
                ref={shouldFocus ? focusOnMount : undefined}
                type="button"
                aria-pressed={selected}
                className={cn(
                  "border rounded-xl border-stroke-soft py-2 px-3 text-left transition-colors flex items-center gap-3 font-medium",
                  selected
                    ? "text-content-ink ring-2 ring-content-ink"
                    : "text-content-subdued"
                )}
                onClick={() => {
                  send({ type: "EDIT" })
                  field.handleChange(intent)
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border-2",
                    selected
                      ? "border-content-ink bg-content-ink"
                      : "bg-transparent"
                  )}
                />
                {t(`intents.${intent}`)}
              </motion.button>
            )
          })}
        </fieldset>
      )}
    </form.Field>
  )
}
