/// <reference path="../../.sst/platform/config.d.ts" />

import { edge, isProd } from "./edge"
import { domain } from "./domain"

export const nextjs = new sst.aws.Nextjs("WEB", {
  path: "apps/web",
  domain: {
    name: isProd ? domain : `${$app.stage}.${domain}`,
    redirects: isProd ? [`www.${domain}`] : [],
  },
  warm: isProd ? 1 : 0,
  environment: {
    NEXT_PUBLIC_SITE_URL: `https://${domain}`,
    SST_STAGE: $app.stage,
  },
  openNextVersion: "4.0.3",
  edge,
  dev: {
    command: "bun run dev",
    directory: "apps/web",
    url: "http://localhost:3003",
  },
})
