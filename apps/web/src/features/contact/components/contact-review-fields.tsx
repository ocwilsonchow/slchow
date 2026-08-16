"use client"

import { useTranslations } from "next-intl"
import {
  CONTACT_FIELD_STEPS,
  type ContactFieldStep,
  type ContactFormValues,
  type ContactIntent,
} from "../schema"

type Props = {
  values: ContactFormValues
}

export function ContactReviewFields({ values }: Props) {
  const t = useTranslations("contact")

  const labels: Record<ContactFieldStep, string> = {
    name: t("review.name"),
    email: t("review.email"),
    intent: t("review.intent"),
    message: t("review.message"),
  }

  const intentLabels: Record<ContactIntent, string> = {
    hiring: t("intents.hiring"),
    project: t("intents.project"),
    collaboration: t("intents.collaboration"),
    other: t("intents.other"),
  }

  return (
    <dl className="m-0 flex flex-col gap-3">
      {CONTACT_FIELD_STEPS.map((field) => {
        const value =
          field === "intent"
            ? values.intent
              ? intentLabels[values.intent]
              : ""
            : values[field]

        return (
          <div
            key={field}
            className="flex flex-col gap-1 rounded-xl border border-stroke-soft px-3 py-2"
          >
            <dt className="text-xs text-content-subdued">{labels[field]}</dt>
            <dd className="m-0 whitespace-pre-wrap wrap-break-word text-content-ink">
              {value}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
