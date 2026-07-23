import { cn } from "@repo/ds"

export function Paragraph(props: React.ComponentProps<"p">) {
  return <p {...props} className={cn("text-content-body", props.className)} />
}