/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "slchow",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "ocwilsonchow",
          region: "ap-east-1",
        },
      },
    }
  },
  async run() {
    // ----- Secrets -----
    const secrets = await import("./secrets")

    // ----- Bucket -----
    const bucket = new sst.aws.Bucket("BUCKET")

    // ----- Website -----
    const website = new sst.aws.Nextjs("WEB", {
      path: "apps/web",
      domain: secrets.DOMAIN.value,
      dev: {
        command: "bun run dev",
        directory: "apps/web",
        url: "http://localhost:4001",
      },
      link: [secrets.DOMAIN],
    })
  },
})
