import { Navbar } from "@/features/navigations/components/navbar"
import { cn } from "@slchow/ds"
import React from "react"

const RootLayout = (props: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex items-start", props.className)} {...props}>
      <Navbar />
      <div className="flex-1 shrink-0">{props.children}</div>
    </div>
  )
}

export default RootLayout
