/// <reference path="../../.sst/platform/config.d.ts" />

import { domain } from "./domain"
import { isProd } from "./edge"

export const router = new sst.aws.Router("Router", {
  domain: isProd ? `api.${domain}` : `${$app.stage}.api.${domain}`,
})
