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
    // ----- Website -----
    new sst.aws.Nextjs("WEB", {
      path: "apps/web",
      domain: {
        name: "dev.slchow.com",
      },
      dev: {
        command: "bun run dev",
        directory: "apps/web",
        url: "http://localhost:3003",
      },
    })
  },
})
