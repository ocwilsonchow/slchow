"use client"

type Props = {
  title: string
  description: string
  retryLabel: string
  onRetry: () => void
}

export function ErrorView({ title, description, retryLabel, onRetry }: Props) {
  return (
    <main
      id="main-content"
      className="flex h-screen items-center justify-center"
    >
      <div className="space-y-5 text-balance text-center">
        <h1 className="text-5xl font-bold text-content-ink md:text-8xl">
          {title}
        </h1>
        <p>{description}</p>
        <button
          type="button"
          className="hover:text-content-ink"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      </div>
    </main>
  )
}
