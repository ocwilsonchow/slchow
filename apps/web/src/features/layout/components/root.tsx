import { cn } from "@repo/ds"
import { AnimatePresence } from "motion/react"

export const RootLayout = (props: React.ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("overflow-x-hidden", props.className)}>
      <AnimatePresence>{props.children}</AnimatePresence>
    </div>
  )
}
