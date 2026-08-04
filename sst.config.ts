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

    // ----- Website -----
    new sst.aws.Nextjs("WEB", {
      path: "apps/web",
      domain: {
        name: domain,
        redirects: [`www.${domain}`],
      },
      // Keep N server Lambda instances warm via a scheduled warmer
      // (EventBridge cron pinging the OpenNext server function).
      // Use 0 on non-prod to avoid paying for idle warmers.
      warm: $app.stage === "production" ? 1 : 0,
      environment: {
        NEXT_PUBLIC_SITE_URL: `https://${domain}`,
      },
      openNextVersion: "4.0.3",
      dev: {
        command: "bun run dev",
        directory: "apps/web",
        url: "http://localhost:3003",
      },
    })
  },
})
