import { createApp } from "@/lib/create-app"
import { createRouter } from "@/lib/create-router"

import { configureBetterAuth } from "./lib/configure-better-auth"
import { configureOpenAPI } from "./lib/configure-openapi"

import info from "@/modules/info"
import agents from "./modules/agents"

const baseApp = await createApp()

const routes = createRouter().route("/", info).route("/agents", agents)

const app = baseApp.route("/api", routes)

configureBetterAuth(app)
configureOpenAPI(app)

type AppType = typeof app

export { app, type AppType }
