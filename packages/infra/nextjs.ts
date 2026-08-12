/// <reference path="../../.sst/platform/config.d.ts" />

import { isProd } from "./edge"
import { router, siteDomain } from "./router"

export const nextjs = new sst.aws.Nextjs("WEB", {
  path: "apps/web",
  router: {
    instance: router,
  },
  warm: isProd ? 1 : 0,
  environment: {
    NEXT_PUBLIC_SITE_URL: `https://${siteDomain}`,
    SST_STAGE: $app.stage,
  },
  openNextVersion: "4.0.3",
  // SST invokes OpenNext directly (skips package.json prebuild). Sync design
  // assets first; OpenNext then runs `bun run build`, which generates
  // `public/search-index/*.json` before `next build`.
  buildCommand:
    "bun run sync:design-assets && npx --yes @opennextjs/aws@4.0.3 build",
  dev: {
    command: "bun run dev",
    directory: "apps/web",
    url: "http://localhost:3003",
  },
})
