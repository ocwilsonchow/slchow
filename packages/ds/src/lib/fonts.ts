import {
  IBM_Plex_Mono as IBMPlexMonoFont,
  IBM_Plex_Sans as IBMPlexSansFont,
} from "next/font/google"

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
