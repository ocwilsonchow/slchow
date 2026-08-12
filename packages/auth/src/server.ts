import { db } from "@repo/db"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { type Auth, betterAuth } from "better-auth"

export type { Auth }
import { nextCookies } from "better-auth/next-js"
import {
  admin,
  lastLoginMethod,
  multiSession,
  oneTimeToken,
  openAPI,
  organization,
  phoneNumber,
  twoFactor,
} from "better-auth/plugins"
import { Resource } from "sst"
import {
  apiHost,
  appHost,
  domain,
  mastraHost,
  siteHost,
} from "@repo/infra/domain"

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

const isLocal = Resource.App.stage === "local"
const stage = Resource.App.stage

const baseURL = isLocal ? "http://localhost:4111" : `https://${apiHost(stage)}`

export const auth = betterAuth({
  baseURL,
  secret: Resource.BETTER_AUTH_SECRET.value,
  session: {
    deferSessionRefresh: true,
  },
  trustedOrigins: [
    "http://localhost:3000", // Mastra Studio
    "http://localhost:3003",
    `https://${siteHost(stage)}`,
    `https://${apiHost(stage)}`,
    `https://${appHost(stage)}`,
    `https://${mastraHost(stage)}`,
  ],
  advanced: {
    cookiePrefix: Resource.App.stage,
    ...(isLocal
      ? {
          defaultCookieAttributes: {
            sameSite: "lax" as const,
            secure: false,
          },
        }
      : {
          crossSubDomainCookies: {
            enabled: true,
            domain: "." + domain,
          },
          defaultCookieAttributes: {
            sameSite: "lax" as const,
            secure: true,
          },
        }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // disableSignUp: true,
  },
  disabledPaths: [],
  plugins: [
    admin(),
    organization(),
    openAPI({
      theme: "alternate",
    }),
    lastLoginMethod(),
    multiSession(),
    twoFactor(),
    phoneNumber(),
    oneTimeToken(),
    nextCookies(),
  ],
})
