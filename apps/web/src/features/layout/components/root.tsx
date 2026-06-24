import { cn } from "@slchow/ds"
import { Navbar } from "@/features/navigations/components/navbar"

const RootLayout = (props: React.ComponentProps<"div">) => {
  return (
    <div className={cn("px-10", props.className)} {...props}>
      <Navbar />
      {props.children}
    </div>
  )
}

export default RootLayout
