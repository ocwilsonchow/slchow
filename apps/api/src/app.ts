import { createApp } from "@/lib/create-app"
import { createRouter } from "@/lib/create-router"

import health from "@/modules/health"

const baseApp = await createApp()

const routes = createRouter().route("/health", health)

const app = baseApp.route("/api", routes)

type AppType = typeof app

export { app, type AppType }
