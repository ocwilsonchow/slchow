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
    // ----- Core -----
    const { domain, edge, isProd } = await import("@repo/infra")

    // ----- CloudFront -----
    const router = new sst.aws.Router("Router", {
      domain: isProd ? `api.${domain}` : `${$app.stage}.api.${domain}`,
    })

    // ----- API -----
    new sst.aws.Function("API", {
      handler: "./apps/api/src/lambda.handler",
      versioning: true,
      url: {
        router: {
          instance: router,
        },
      },
    })

    // ----- Website -----
    new sst.aws.Nextjs("WEB", {
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
  },
})
