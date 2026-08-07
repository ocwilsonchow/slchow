import { password, username } from "./secrets"

export const isProd = $app.stage === "production"

// Password-protect non-prod only via CloudFront Basic Auth
export const edge = !isProd
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
