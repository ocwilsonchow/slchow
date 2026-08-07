/// <reference path="../../.sst/platform/config.d.ts" />

import { cluster } from "./cluster"
import { router } from "./router"
import { aiGatewayApiKey, betterAuthSecret, databaseUrl } from "./secrets"

export const api = new sst.aws.Service("API", {
  cluster,
  image: {
    context: ".",
    dockerfile: "apps/api/Dockerfile",
  },
  link: [databaseUrl, betterAuthSecret, aiGatewayApiKey],
  environment: {
    PORT: "3004",
  },
  loadBalancer: {
    rules: [{ listen: "80/http", forward: "3004/http" }],
    health: {
      "3004/http": {
        path: "/api/health",
      },
    },
  },
  dev: {
    command: "bun run --hot src/index.ts",
    directory: "apps/api",
    url: "http://localhost:3004",
  },
})

router.route("/", api.url)
