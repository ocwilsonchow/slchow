/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "oc2",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "sinlongchow",
          region: "ap-east-1",
        },
      },
    }
  },
  async run() {
    const domain = "slchow.com"

    // Password-protect non-prod only via CloudFront Basic Auth
    const isProd = $app.stage === "production"
    const edge = !isProd
      ? (() => {
          const username = new sst.Secret("USERNAME")
          const password = new sst.Secret("PASSWORD")
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

    // ----- Website -----
    new sst.aws.Nextjs("WEB", {
      path: "apps/web",
      domain: {
        name: isProd ? domain : `dev.${domain}`,
        redirects: isProd ? [`www.${domain}`] : [],
      },
      // Keep N server Lambda instances warm via a scheduled warmer
      // (EventBridge cron pinging the OpenNext server function).
      // Use 0 on non-prod to avoid paying for idle warmers.
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
  },
})
