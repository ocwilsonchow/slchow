import { PageLayout } from "@/features/layout/components/page"

type Props = {
  title: string
  description: string
}

export function NotFoundView({ title, description }: Props) {
  return (
    <PageLayout className="flex h-screen items-center justify-center">
      <div className="space-y-5 text-balance text-center">
        <h1 className="text-5xl font-bold text-content-ink md:text-8xl">
          {title}
        </h1>
        <p>{description}</p>
      </div>
    </PageLayout>
  )
}
