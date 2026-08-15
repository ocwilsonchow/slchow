"use client"

import { cn } from "@repo/ds"
import type { ChangeEvent } from "react"
import type { ContactFormEvent } from "../contact-form-machine"
import type { useContactForm } from "../hooks/use-contact-form"

const inputClassName =
  "w-full border-b border-stroke-soft bg-transparent py-2 text-content-ink caret-content-ink placeholder:text-content-subdued"

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
  return (
    <form.Field name={name}>
      {(field) => {
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
          "aria-describedby": describedBy,
        }

        if (multiline) {
          return (
            <textarea
              {...shared}
              rows={5}
              className={cn(inputClassName, "resize-y")}
            />
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
