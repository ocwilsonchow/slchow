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
    const domain = "dev.slchow.com"

    // ----- Website -----
    new sst.aws.Nextjs("WEB", {
      path: "apps/web",
      domain: {
        name: domain,
      },
      environment: {
        NEXT_PUBLIC_SITE_URL: `https://${domain}`,
      },
      dev: {
        command: "bun run dev",
        directory: "apps/web",
        url: "http://localhost:3003",
      },
    })
  },
})
