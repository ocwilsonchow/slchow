"use client"

import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@repo/ds"
import { getCurrentTrack, useMusicPlayer } from "../hooks/use-music-player"

export const MusicPlayer = ({ className }: { className?: string }) => {
  const t = useTranslations("navigation")
  const { index, isPlaying, toggle, next, previous } = useMusicPlayer()
  const track = getCurrentTrack(index)

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 min-w-0 max-w-full",
        className
      )}
    >
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={previous}
          aria-label={t("previous")}
          className="p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <span>Previous</span>
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? t("pause") : t("play")}
          className="p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          {isPlaying ? <span>Pause</span> : <span>Play</span>}
        </button>
        <button
          type="button"
          onClick={next}
          aria-label={t("next")}
          className="p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <span>Next</span>
        </button>
      </div>
      <p
        className="truncate min-w-0 text-sm"
        aria-live="polite"
        title={track.title}
      >
        <span className="sr-only">{t("nowPlaying")}: </span>
        {track.title}
      </p>
    </div>
  )
}
