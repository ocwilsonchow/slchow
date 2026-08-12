import { Resource } from "sst"

/**
 * Production-only PostHog project token from the linked SST Secret.
 * Secret is declared in every stage (stable generated types) but linked
 * only in production. Uses `SST_STAGE` so CI / plain `next build` never
 * touch `Resource` — SST links are inactive outside `sst dev` / deploy.
 * Cast keeps typecheck green when `sst-env.d.ts` is absent (gitignored).
 */
export function getPostHogProjectToken(): string | undefined {
  if (process.env.SST_STAGE !== "production") return undefined

  try {
    return (
      Resource as typeof Resource & {
        POSTHOG_PROJECT_TOKEN: { value: string }
      }
    ).POSTHOG_PROJECT_TOKEN.value
  } catch {
    return undefined
  }
}
