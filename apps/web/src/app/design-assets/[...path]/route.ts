import { serveDesignImage } from "@/features/design/serve-design-image"

type Props = {
  params: Promise<{ path: string[] }>
}

export async function GET(_request: Request, { params }: Props) {
  const { path } = await params
  return serveDesignImage(path)
}
