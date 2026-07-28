import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogSize = {
  width: 1200,
  height: 630,
} as const

export const ogContentType = "image/png"

const fontsDir = join(process.cwd(), "src/features/og/fonts")

async function loadOgFonts() {
  const [semiBold, regular] = await Promise.all([
    readFile(join(fontsDir, "AtAero-SemiBold.ttf")),
    readFile(join(fontsDir, "AtAero-Regular.ttf")),
  ])
  return { semiBold, regular }
}

type CreateOgImageOptions = {
  title?: string
  description?: string
  url?: string
}

export async function createOgImage({
  title = "Wilson Chow",
  description = "Software developer — product, design systems, and AI agents.",
  url = "dev.slchow.com",
}: CreateOgImageOptions = {}) {
  const { semiBold, regular } = await loadOgFonts()

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f0fb29",
        color: "#0f0f10",
        fontFamily: "AtAero",
        padding: 72,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: title.length > 32 ? 64 : 80,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: "-0.04em",
          maxWidth: 980,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          width: "100%",
          fontSize: 22,
          fontWeight: 400,
          opacity: 0.85,
        }}
      >
        <div style={{ display: "flex", maxWidth: 720 }}>{description}</div>
        <div style={{ display: "flex" }}>{url}</div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        {
          name: "AtAero",
          data: semiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "AtAero",
          data: regular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  )
}
