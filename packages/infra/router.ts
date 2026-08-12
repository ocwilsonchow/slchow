/// <reference path="../../.sst/platform/config.d.ts" />

import { apiHost, domain, siteHost } from "./domain"
import { basicAuthEdge, isProd } from "./edge"

export const siteDomain = siteHost($app.stage)
export const apiDomain = apiHost($app.stage)

/**
 * Shared CloudFront front door for the site and future API/Lambda origins.
 * Owns custom domain, non-prod Basic Auth, and production WAF.
 */
export const router = new sst.aws.Router("Router", {
  domain: {
    name: siteDomain,
    aliases: [isProd ? `*.${domain}` : `*.${$app.stage}.${domain}`],
    redirects: isProd ? [`www.${domain}`] : [],
  },
  waf: isProd
    ? {
        // Limits abuse of first-party `/ingest` (and the rest of the site).
        rateLimitPerIp: 1000,
      }
    : undefined,
  edge: basicAuthEdge,
})
