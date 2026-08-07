import { db } from "@repo/db"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { type Auth, betterAuth } from "better-auth"
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
import { domain } from "@repo/infra"

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

const baseURL = `https://${Resource.App.stage}.api.${domain}`

export const auth = betterAuth({
  baseURL,
  secret: Resource.BETTER_AUTH_SECRET.value,
  session: {
    deferSessionRefresh: true,
  },
  trustedOrigins: [
    `https://${Resource.App.stage}.api.${domain}`,
    `https://${Resource.App.stage}.app.${domain}`,
    `https://${Resource.App.stage}.mastra.${domain}`,
  ],
  advanced: {
    cookiePrefix: Resource.App.stage,
    crossSubDomainCookies: {
      enabled: true,
      domain: "." + domain,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: true,
    },
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
