import { EB_Garamond, Geist, Geist_Mono, Inter, Noto_Serif, Noto_Serif_Display, Noto_Serif_Georgian, Noto_Serif_HK } from "next/font/google"
import localFont from "next/font/local"

export const FontSans = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const FontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["monospace"],
})

export const FontAero = localFont({
  src: "../fonts/AtAeroVARVF.ttf",
  variable: "--font-aero",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const FontInter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const FontGeist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const FontSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif",
  display: "swap",
  fallback: ["serif"],
})
