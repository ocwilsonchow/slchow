/// <reference path="../../.sst/platform/config.d.ts" />

import { isDev, isProd } from "./edge"
import { router, siteDomain } from "./router"
import {
  contactDiscordWebhook,
  posthogProjectToken,
  turnstileSecret,
} from "./secrets"

export const nextjs = new sst.aws.Nextjs("WEB", {
  path: "apps/web",
  router: {
    instance: router,
  },
  link: [
    ...(isProd ? [posthogProjectToken, turnstileSecret] : []),
    ...(isProd || isDev ? [contactDiscordWebhook] : []),
  ],
  warm: isProd ? 1 : 0,
  environment: {
    NEXT_PUBLIC_SITE_URL: `https://${siteDomain}`,
    SST_STAGE: $app.stage,
    ...(isProd ? { TURNSTILE_HOSTNAMES: siteDomain } : {}),
  },
  openNextVersion: "4.1.0",
  // Keep local CI packaging and SST deployments on the same OpenNext path.
  // OpenNext runs `bun run build`, which generates the search index first.
  buildCommand: "bun run build:open-next",
  dev: {
    command: "bun run dev",
    directory: "apps/web",
    url: "http://localhost:3003",
  },
})
