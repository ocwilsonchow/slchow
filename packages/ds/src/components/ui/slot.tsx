import { Slot as SlotPrimitive } from "@radix-ui/react-slot"
import type { ComponentProps } from "react"

function Slot(props: ComponentProps<typeof SlotPrimitive>) {
  return <SlotPrimitive {...props} />
}

export { Slot }
