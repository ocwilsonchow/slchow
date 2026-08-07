import { apiKeyClient } from "@better-auth/api-key/client"
import {
  adminClient,
  phoneNumberClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  lastLoginMethodClient,
  twoFactorClient,
  oneTimeTokenClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location

    if (hostname.includes(".app.")) {
      return `${protocol}//${hostname.replace(".app.", ".api.")}`
    }

    if (hostname.includes(".api.")) {
      return `${protocol}//${hostname}`
    }
  }

  return "http://localhost:3003"
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    adminClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
    apiKeyClient(),
    magicLinkClient(),
    lastLoginMethodClient(),
    multiSessionClient(),
    twoFactorClient(),
    phoneNumberClient(),
    oneTimeTokenClient(),
  ],
})
