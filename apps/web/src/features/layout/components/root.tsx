import { cn } from "@repo/ds"

export const RootLayout = (props: React.ComponentProps<"div">) => {
  return <div {...props} className={cn("overflow-x-hidden", props.className)} />
}
