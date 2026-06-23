import type { PropsWithChildren } from "react"

type LayoutProps = PropsWithChildren<{
  params: Promise<{ locale: string }>
}>

export default async function Layout({ children, params }: LayoutProps) {
  const { locale } = await params

  return <div className="">{children}</div>
}
