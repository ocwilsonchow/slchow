const CLICK_SOUND_SRC = "/sounds/navbar-open.wav"

let audio: HTMLAudioElement | null = null

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getAudio() {
  if (typeof window === "undefined") return null

  if (!audio) {
    audio = new Audio(CLICK_SOUND_SRC)
    audio.preload = "auto"
  }

  return audio
}

export function preloadClickSound() {
  getAudio()?.load()
}

/** UI click. No-ops under prefers-reduced-motion. */
export function playClickSound() {
  if (typeof window === "undefined") return
  if (prefersReducedMotion()) return

  const el = getAudio()
  if (!el) return

  el.currentTime = 0
  void el.play().catch(() => {})
}

/** Primary press — starts audio before click handlers run React updates. */
export function playClickSoundOnPointerDown(event: { button: number }) {
  if (event.button === 0) playClickSound()
}

/** Keyboard activation has no pointerdown (`click.detail === 0`). */
export function playClickSoundOnKeyboardClick(event: { detail: number }) {
  if (event.detail === 0) playClickSound()
}
