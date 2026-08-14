import { cn } from "@repo/ds"
import { AnimatePresence } from "motion/react"

export const RootLayout = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("max-w-screen overflow-x-clip", props.className)}
    >
      <AnimatePresence>{props.children}</AnimatePresence>
    </div>
  )
}
