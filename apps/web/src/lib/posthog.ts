import { Resource } from "sst"

/** Linked only on production (`packages/infra/nextjs.ts`); absent from other stage types. */
type ProductionPostHogResources = {
  POSTHOG_PROJECT_TOKEN: { value: string }
}

/**
 * Production-only PostHog project token from the linked SST Secret.
 * Uses `SST_STAGE` (set by infra) so CI / plain `next build` never touch
 * `Resource` — SST links are inactive outside `sst dev` / deploy.
 */
export function getPostHogProjectToken(): string | undefined {
  if (process.env.SST_STAGE !== "production") return undefined

  try {
    return (Resource as typeof Resource & ProductionPostHogResources)
      .POSTHOG_PROJECT_TOKEN.value
  } catch {
    return undefined
  }
}
