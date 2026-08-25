"use client"

import { cn } from "@repo/ds"
import { useTranslations } from "next-intl"
import type { ChangeEvent } from "react"
import type { ContactFormEvent } from "../contact-form-machine"
import type { useContactForm } from "../hooks/use-contact-form"
import { CONTACT_MESSAGE_MAX_LENGTH } from "../schema"

const inputClassName =
  "w-full border border-stroke-soft rounded-xl bg-transparent py-2 px-3 text-base md:text-sm text-content-ink caret-content-ink placeholder:text-content-subdued"

type ContactFormApi = ReturnType<typeof useContactForm>["form"]

type Props = {
  form: ContactFormApi
  name: "name" | "email" | "message"
  send: (event: ContactFormEvent) => void
  focusOnMount: ReturnType<typeof useContactForm>["focusOnMount"]
  invalid: boolean
  describedBy?: string
  placeholder: string
  multiline?: boolean
  type?: "text" | "email"
  autoComplete?: string
  autoCapitalize?: "words"
  inputMode?: "email"
}

export function ContactTextField({
  form,
  name,
  send,
  focusOnMount,
  invalid,
  describedBy,
  placeholder,
  multiline = false,
  type = "text",
  autoComplete,
  autoCapitalize,
  inputMode,
}: Props) {
  const t = useTranslations("contact")

  return (
    <form.Field name={name}>
      {(field) => {
        const countId = `${field.name}-character-count`
        const describedByIds = [describedBy, multiline ? countId : undefined]
          .filter(Boolean)
          .join(" ")

        const shared = {
          ref: focusOnMount,
          id: field.name,
          name: field.name,
          placeholder,
          value: field.state.value,
          onBlur: field.handleBlur,
          onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            send({ type: "EDIT" })
            field.handleChange(event.target.value)
          },
          "aria-invalid": invalid,
          "aria-describedby": describedByIds || undefined,
        }

        if (multiline) {
          return (
            <div className="flex flex-col gap-1.5">
              <textarea
                {...shared}
                rows={5}
                maxLength={CONTACT_MESSAGE_MAX_LENGTH}
                data-lenis-prevent
                className={cn(inputClassName, "resize-y")}
              />
              <p
                id={countId}
                className="text-sm tabular-nums text-content-subdued"
              >
                {t("characterCount", {
                  count: field.state.value.length,
                  max: CONTACT_MESSAGE_MAX_LENGTH,
                })}
              </p>
            </div>
          )
        }

        return (
          <input
            {...shared}
            type={type}
            autoComplete={autoComplete}
            autoCapitalize={autoCapitalize}
            inputMode={inputMode}
            className={inputClassName}
          />
        )
      }}
    </form.Field>
  )
}
