/// <reference path="../../.sst/platform/config.d.ts" />

import { router } from "./router"

export const api = new sst.aws.Function("API", {
  handler: "./apps/api/src/lambda.handler",
  versioning: true,
  url: {
    router: {
      instance: router,
    },
  },
})
