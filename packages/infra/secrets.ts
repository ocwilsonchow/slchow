export const username = new sst.Secret("USERNAME", "username")
export const password = new sst.Secret("PASSWORD", "password")
export const aiGatewayApiKey = new sst.Secret("AI_GATEWAY_API_KEY")
export const databaseUrl = new sst.Secret("DATABASE_URL")
export const betterAuthSecret = new sst.Secret("BETTER_AUTH_SECRET")
/** Declared in every stage so `sst-env.d.ts` stays stable; linked only in production. */
export const posthogProjectToken = new sst.Secret("POSTHOG_PROJECT_TOKEN", "")
export const turnstileSecret = new sst.Secret("TURNSTILE_SECRET", "")
export const contactDiscordWebhook = new sst.Secret(
  "CONTACT_DISCORD_WEBHOOK",
  ""
)
