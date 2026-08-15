"use client"

import { cn } from "@repo/ds"
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
          className="m-0 flex flex-col border-0 p-0"
          onKeyDown={handleKeyDown}
        >
          {CONTACT_INTENTS.map((intent, index) => {
            const selected = field.state.value === intent
            const shouldFocus = selected || (index === 0 && !field.state.value)
            return (
              <button
                key={intent}
                ref={shouldFocus ? focusOnMount : undefined}
                type="button"
                aria-pressed={selected}
                className={cn(
                  "border-b border-stroke-soft py-2 text-left transition-colors",
                  selected
                    ? "text-content-ink"
                    : "text-content-subdued hover:text-content-ink"
                )}
                onClick={() => {
                  send({ type: "EDIT" })
                  field.handleChange(intent)
                }}
              >
                {t(`intents.${intent}`)}
              </button>
            )
          })}
        </fieldset>
      )}
    </form.Field>
  )
}
