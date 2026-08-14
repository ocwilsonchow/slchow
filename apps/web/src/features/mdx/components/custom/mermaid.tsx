"use client"

import { useTheme } from "@repo/ds"
import { Minus, Plus, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { use, useEffect, useId, useRef, useState } from "react"

const diagramStyleVersion = "v3"
const fontFamily =
  "var(--font-sans), Geist, ui-sans-serif, system-ui, sans-serif"
const minZoom = 0.5
const maxZoom = 2
const zoomStep = 0.25

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <MermaidContent chart={chart} />
}

const cache = new Map<string, Promise<unknown>>()
let mermaidMountCount = 0

function removeMermaidTooltip() {
  document.querySelector(".mermaidTooltip")?.remove()
}

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key)
  if (cached) return cached as Promise<T>

  const promise = setPromise()
  cache.set(key, promise)
  return promise
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId().replaceAll(":", "")
  const diagramRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const { resolvedTheme } = useTheme()
  const t = useTranslations("a11y")
  const isDark = resolvedTheme === "dark"
  const { default: mermaid } = use(
    cachePromise("mermaid", () => import("mermaid"))
  )

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    fontFamily,
    themeVariables: {
      background: isDark ? "#121212" : "#f5f5f5",
      primaryColor: isDark ? "#1f2118" : "#f3f7d7",
      primaryTextColor: isDark ? "#ffffff" : "#3f3d39",
      primaryBorderColor: isDark ? "#f0fb2966" : "#7c821f66",
      secondaryColor: isDark ? "#2a2a2a" : "#ecece8",
      secondaryTextColor: isDark ? "#ffffff" : "#3f3d39",
      secondaryBorderColor: isDark ? "#fafafa33" : "#3f3d3933",
      tertiaryColor: isDark ? "#181818" : "#fafafa",
      tertiaryTextColor: isDark ? "#c1c1c1" : "#6e6e6e",
      tertiaryBorderColor: isDark ? "#fafafa26" : "#3f3d3926",
      nodeBkg: isDark ? "#1f2118" : "#f3f7d7",
      nodeBorder: isDark ? "#f0fb2966" : "#7c821f66",
      nodeTextColor: isDark ? "#ffffff" : "#3f3d39",
      clusterBkg: isDark ? "#181818" : "#fafafa",
      clusterBorder: isDark ? "#fafafa26" : "#3f3d3926",
      lineColor: isDark ? "#c1c1c1" : "#6e6e6e",
      edgeLabelBackground: isDark ? "#2a2a2a" : "#f5f5f5",
      fontFamily,
      fontSize: "12px",
    },
    themeCSS: `
      .node rect,
      .node polygon,
      .node circle,
      .node path {
        stroke-width: 1.5px;
        rx: 8px;
        ry: 8px;
      }

      .nodeLabel,
      .edgeLabel,
      .cluster-label {
        font-size: 12px;
        line-height: 1.35;
      }

      .cluster rect {
        rx: 12px;
        ry: 12px;
        stroke-width: 1px;
      }
    `,
    flowchart: {
      htmlLabels: true,
      useMaxWidth: false,
      wrappingWidth: 180,
      padding: 12,
      nodeSpacing: 40,
      rankSpacing: 40,
    },
    sequence: {
      useMaxWidth: false,
      actorMargin: 40,
      messageMargin: 40,
      wrap: true,
      width: 160,
    },
  })

  const { svg } = use(
    cachePromise(`${diagramStyleVersion}-${chart}-${resolvedTheme}`, () =>
      mermaid.render(id, chart.replaceAll("\\n", "\n"))
    )
  )

  useEffect(() => {
    mermaidMountCount += 1
    return () => {
      mermaidMountCount -= 1
      if (mermaidMountCount === 0) {
        removeMermaidTooltip()
      }
    }
  }, [])

  useEffect(() => {
    if (!svg) return

    const container = diagramRef.current
    const svgElement = diagramRef.current?.querySelector("svg")
    if (!container || !svgElement) return

    const naturalWidth = Number(svgElement.getAttribute("width"))
    const naturalHeight = Number(svgElement.getAttribute("height"))
    if (!Number.isFinite(naturalWidth) || !Number.isFinite(naturalHeight))
      return

    const resizeDiagram = () => {
      const styles = getComputedStyle(container)
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight)
      const availableWidth = container.clientWidth - horizontalPadding
      const fitScale = Math.min(1, availableWidth / naturalWidth)
      const effectiveScale = fitScale * zoom

      svgElement.style.width = `${naturalWidth * effectiveScale}px`
      svgElement.style.height = `${naturalHeight * effectiveScale}px`
    }

    resizeDiagram()

    const resizeObserver = new ResizeObserver(resizeDiagram)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [svg, zoom])

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.min(maxZoom, Math.max(minZoom, nextZoom)))
  }

  return (
    <div className="relative my-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-stroke-soft bg-surface-alpha/25">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-lg border border-stroke-soft bg-surface-canvas/90 p-1 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          aria-label={t("zoomOutDiagram")}
          title={t("zoomOutDiagram")}
          className="flex size-7 items-center justify-center rounded-md text-content-body transition-colors hover:bg-surface-alpha disabled:cursor-not-allowed disabled:opacity-40"
          disabled={zoom <= minZoom}
          onClick={() => updateZoom(zoom - zoomStep)}
        >
          <Minus aria-hidden="true" className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={t("resetDiagramZoom")}
          title={t("resetDiagramZoom")}
          className="flex h-7 min-w-11 items-center justify-center gap-1 rounded-md px-1.5 font-mono text-[11px] text-content-body transition-colors hover:bg-surface-alpha"
          onClick={() => updateZoom(1)}
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          aria-label={t("zoomInDiagram")}
          title={t("zoomInDiagram")}
          className="flex size-7 items-center justify-center rounded-md text-content-body transition-colors hover:bg-surface-alpha disabled:cursor-not-allowed disabled:opacity-40"
          disabled={zoom >= maxZoom}
          onClick={() => updateZoom(zoom + zoomStep)}
        >
          <Plus aria-hidden="true" className="size-3.5" />
        </button>
      </div>
      <div
        className="min-w-0 max-w-full overflow-x-auto p-4 pt-12 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-none"
        ref={diagramRef}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid returns trusted SVG from local chart source
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
