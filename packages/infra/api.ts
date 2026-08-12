/// <reference path="../../.sst/platform/config.d.ts" />

import { cluster } from "./cluster"
import { apiDomain, router } from "./router"
import { aiGatewayApiKey, betterAuthSecret, databaseUrl } from "./secrets"

export const api = new sst.aws.Service("API", {
  cluster,
  image: {
    context: ".",
    dockerfile: "apps/api/Dockerfile",
  },
  link: [databaseUrl, betterAuthSecret, aiGatewayApiKey],
  environment: {
    PORT: "4111",
  },
  loadBalancer: {
    rules: [{ listen: "80/http", forward: "4111/http" }],
    health: {
      "4111/http": {
        path: "/api/health",
      },
    },
  },
  dev: {
    command: "bun run dev",
    directory: "apps/api",
    url: "http://localhost:4111",
  },
})

// Route API traffic on the shared Router subdomain (api.slchow.com / api.{stage}.slchow.com).
router.route(`${apiDomain}/`, api.url)
