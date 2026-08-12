import { Resource } from "sst"

/** Production-only PostHog project token from the linked SST Secret. */
export function getPostHogProjectToken(): string | undefined {
  if (Resource.App.stage !== "production") return undefined

  return Resource.POSTHOG_PROJECT_TOKEN.value
}
