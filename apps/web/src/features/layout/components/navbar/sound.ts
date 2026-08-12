let audio: HTMLAudioElement | null = null

const getAudio = () => {
  if (typeof window === "undefined") return null

  if (!audio) {
    audio = new Audio("/sounds/navbar-open.wav")
    audio.preload = "auto"
  }

  return audio
}

export function preloadNavbarToggleSound() {
  const el = getAudio()
  el?.load()
}

export function playNavbarToggleSound() {
  const el = getAudio()
  if (!el) return

  el.currentTime = 0
  void el.play().catch(() => {})
}
