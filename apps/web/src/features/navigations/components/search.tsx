"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

type SearchContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used within SearchProvider")
  }

  return context
}

export function SearchRoot({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className="relative" {...props}>
      {children}
    </div>
  )
}

export function SearchInput({
  children,
  ...props
}: React.ComponentProps<"input">) {
  return <input className="w-full uppercase h-[50px] px-3 border-b" {...props} />
}
