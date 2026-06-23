import {
  IBM_Plex_Mono as IBMPlexMonoFont,
  IBM_Plex_Sans as IBMPlexSansFont,
  IBM_Plex_Serif as IBMPlexSerifFont,
} from "next/font/google"
import localFont from "next/font/local"

export const FontSans = IBMPlexSansFont({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const FontMono = IBMPlexMonoFont({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["monospace"],
})

export const FontSerif = IBMPlexSerifFont({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
  fallback: ["serif"],
})

export const FontAero = localFont({
  src: "../fonts/AtAeroVARVF.ttf",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})
