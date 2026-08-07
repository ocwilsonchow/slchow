import { createApp } from "@/lib/create-app"
import { createRouter } from "@/lib/create-router"

import info from "@/modules/info"

const baseApp = await createApp()

const routes = createRouter().route("/", info)

const app = baseApp.route("/api", routes)

type AppType = typeof app

export { app, type AppType }
