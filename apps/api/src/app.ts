import { createApp } from "@/lib/create-app"
import { createRouter } from "@/lib/create-router"

import info from "@/modules/info"
import { configureBetterAuth } from "./lib/configure-better-auth"
import { configureOpenAPI } from "./lib/configure-openapi"

const baseApp = await createApp()

const routes = createRouter().route("/", info)

const app = baseApp.route("/api", routes)

configureBetterAuth(app)
configureOpenAPI(app)

type AppType = typeof app

export { app, type AppType }
