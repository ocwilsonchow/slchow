import { Resource } from "sst"

/** Linked only on production (`packages/infra/nextjs.ts`); absent from other stage types. */
type ProductionPostHogResources = {
  POSTHOG_PROJECT_TOKEN: { value: string }
}

/** Production-only PostHog project token from the linked SST Secret. */
export function getPostHogProjectToken(): string | undefined {
  if (Resource.App.stage !== "production") return undefined

  return (Resource as typeof Resource & ProductionPostHogResources)
    .POSTHOG_PROJECT_TOKEN.value
}
