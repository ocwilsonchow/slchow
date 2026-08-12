/// <reference path="../../.sst/platform/config.d.ts" />

import { password, username } from "./secrets"

export const isProd = $app.stage === "production"

/** Non-prod CloudFront Basic Auth for the shared Router. */
export const basicAuthEdge = !isProd
  ? (() => {
      const basicAuth = $resolve([username.value, password.value]).apply(
        ([username, password]) =>
          Buffer.from(`${username}:${password}`).toString("base64")
      )
      return {
        viewerRequest: {
          injection: $interpolate`
            if (
              !event.request.headers.authorization
              || event.request.headers.authorization.value !== "Basic ${basicAuth}"
            ) {
              return {
                statusCode: 401,
                headers: {
                  "www-authenticate": { value: "Basic" }
                }
              };
            }`,
        },
      }
    })()
  : undefined
