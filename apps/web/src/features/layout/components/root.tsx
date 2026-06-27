import { cn } from "@slchow/ds"
import { Navbar } from "@/features/navigations/components/navbar"

const RootLayout = (props: React.ComponentProps<"div">) => {
  return (
    <div className={cn("", props.className)} {...props}>
      <Navbar />
      <div className="pt-[64px] max-w-screen-2xl mx-auto px-3 lg:px-10">
        {props.children}
      </div>
    </div>
  )
}

export default RootLayout
