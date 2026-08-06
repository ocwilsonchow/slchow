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
    const { edge, isProd } = await import("./infra/edge")

    // ----- API -----
    new sst.aws.Function("API", {
      handler: "./apps/api/src/lambda.handler",
      versioning: true,
    })

    // ----- Mastra -----
    const aiGatewayApiKey = new sst.Secret("AI_GATEWAY_API_KEY")

    const vpc = new sst.aws.Vpc("Vpc")
    const cluster = new sst.aws.Cluster("Cluster", { vpc })

    new sst.aws.Service("MASTRA", {
      cluster,
      image: {
        context: "apps/mastra",
        dockerfile: "Dockerfile",
      },
      loadBalancer: {
        domain: isProd ? `mastra.${domain}` : `dev.mastra.${domain}`,
        ports: [
          { listen: "80/http", redirect: "443/https" },
          { listen: "443/https", forward: "8080/http" },
        ],
        health: { "8080/http": { path: "/api" } },
      },
      dev: {
        command: "bun run dev",
        directory: "apps/mastra",
        url: "http://localhost:4111",
      },
      environment: {
        AI_GATEWAY_API_KEY: aiGatewayApiKey.value,
      },
    })

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
