import { useMutation } from "@tanstack/react-query"
import {
  type ContactApiSource,
  type ContactRequest,
  isContactApiFailure,
  isContactApiSuccess,
} from "../schema"

export class ContactRequestError extends Error {
  readonly source: ContactApiSource | "unknown"

  constructor(source: ContactApiSource | "unknown") {
    super("Contact request failed")
    this.name = "ContactRequestError"
    this.source = source
  }
}

export function useContactMutation() {
  return useMutation({
    mutationFn: async (input: ContactRequest) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      const data: unknown = await response.json().catch(() => null)

      if (!response.ok || !isContactApiSuccess(data)) {
        throw new ContactRequestError(
          isContactApiFailure(data) ? data.source : "unknown"
        )
      }

      return data
    },
  })
}
