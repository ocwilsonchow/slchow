"use client"

import { cn, useTheme } from "@slchow/ds"
import { useEffect, useState } from "react"

const themeOptions = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "System",
    value: "system",
  },
] as const satisfies { label: string; value: "light" | "dark" | "system" }[]

export const ThemeSelect = () => {
  const { theme: currentTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center border divide-x">
      {themeOptions.map((option) => (
        <button
          className={cn(
            "w-7 h-7 shrink-0 flex items-center justify-center hover:bg-surface-hover hover:text-content-ink",
            mounted && option.value === currentTheme ? "bg-surface-hover" : ""
          )}
          type="button"
          key={option.value}
          onClick={() => setTheme(option.value)}
        ></button>
      ))}
    </div>
  )
}
