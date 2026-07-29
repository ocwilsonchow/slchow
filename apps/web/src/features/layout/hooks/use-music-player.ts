"use client"

import { create } from "zustand"
import { playlist } from "../lib/playlist"

type MusicState = {
  index: number
  isPlaying: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  previous: () => void
  setTrack: (index: number) => void
}

let audio: HTMLAudioElement | null = null
let listenersAttached = false

const getAudio = () => {
  if (typeof window === "undefined") return null

  if (!audio) {
    audio = new Audio(playlist[0].src)
    audio.preload = "metadata"
  }

  return audio
}

const wrapIndex = (index: number) => {
  const length = playlist.length
  return ((index % length) + length) % length
}

const loadTrack = (index: number, shouldPlay: boolean) => {
  const el = getAudio()
  if (!el) return

  el.src = playlist[index].src
  el.load()

  if (shouldPlay) {
    void el.play().then(
      () => useMusicPlayer.setState({ isPlaying: true }),
      () => useMusicPlayer.setState({ isPlaying: false })
    )
  }
}

const attachListeners = () => {
  if (listenersAttached) return

  const el = getAudio()
  if (!el) return

  el.addEventListener("ended", () => {
    useMusicPlayer.getState().next()
  })

  listenersAttached = true
}

export const useMusicPlayer = create<MusicState>((set, get) => ({
  index: 0,
  isPlaying: false,

  play: () => {
    attachListeners()
    const el = getAudio()
    if (!el) return

    void el.play().then(
      () => set({ isPlaying: true }),
      () => set({ isPlaying: false })
    )
  },

  pause: () => {
    const el = getAudio()
    el?.pause()
    set({ isPlaying: false })
  },

  toggle: () => {
    const { isPlaying, play, pause } = get()
    if (isPlaying) pause()
    else play()
  },

  next: () => {
    const nextIndex = wrapIndex(get().index + 1)
    set({ index: nextIndex })
    attachListeners()
    loadTrack(nextIndex, true)
  },

  previous: () => {
    const prevIndex = wrapIndex(get().index - 1)
    set({ index: prevIndex })
    attachListeners()
    loadTrack(prevIndex, true)
  },

  setTrack: (index: number) => {
    const nextIndex = wrapIndex(index)
    const shouldPlay = get().isPlaying
    set({ index: nextIndex })
    attachListeners()
    loadTrack(nextIndex, shouldPlay)
  },
}))

export const getCurrentTrack = (index: number) => playlist[wrapIndex(index)]
