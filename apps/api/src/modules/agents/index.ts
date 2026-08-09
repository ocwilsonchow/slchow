import { listAgentsRoute } from "./routes"
import { listAgentsHandler } from "./handlers"
import { createRouter } from "@/lib/create-router"

const router = createRouter().openapi(listAgentsRoute, listAgentsHandler)

export default router
