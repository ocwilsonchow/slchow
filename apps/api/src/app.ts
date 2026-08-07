import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" })
})

type AppType = typeof app

export { app, type AppType }
