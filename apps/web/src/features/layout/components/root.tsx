import { cn } from "@repo/ds"

export const RootLayout = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("max-w-screen overflow-x-clip", props.className)}
    />
  )
}
