import { OpenAPIHono, z } from "@hono/zod-openapi"
import { AppBindings } from "@/lib/types"

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false,
            errors: z.treeifyError(result.error),
            source: "validation",
          },
          422
        )
      }
    },
  })
}
