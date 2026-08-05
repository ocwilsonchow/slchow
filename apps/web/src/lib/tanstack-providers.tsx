"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"

import { getQueryClient } from "@/lib/get-query-client"
import { silenceReactDevtoolsNoise } from "@/lib/silence-react-devtools-noise"

// Install as early as the client module evaluates; useEffect covers remounts.
silenceReactDevtoolsNoise()

export function TanstackProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  useEffect(() => {
    silenceReactDevtoolsNoise()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
