import localFont from "next/font/local"

/** Site UI font — imported alone so unused faces in `fonts.ts` never evaluate. */
export const FontAero = localFont({
  src: [
    {
      path: "../fonts/AtAeroVARVF.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-aero",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})
