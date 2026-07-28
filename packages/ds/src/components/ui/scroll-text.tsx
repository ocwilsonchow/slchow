"use client"

import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionValueEvent,
  useTransform,
} from "motion/react"
import { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"

export type TextWord = {
  type: "word"
  content: string
  highlight?: boolean
}

export type TextParagraph = {
  type: "paragraph"
  content: TextWord[]
}

export type TextChunks = TextParagraph[]

type IndexedTextWord = TextWord & {
  index: number
  start: number
  end: number
}

type IndexedTextParagraph = {
  type: "paragraph"
  content: IndexedTextWord[]
}

type IndexedTextChunks = IndexedTextParagraph[]

export function buildIndexedTextChunks(
  chunks: TextChunks,
  overlap = 0.5
): IndexedTextChunks {
  const wordCount = getTextChunkWordCount(chunks)
  if (wordCount === 0) return []

  const segmentDuration = 1 / ((wordCount - 1) * overlap + 1)

  let index = 0
  let previousStart = 0

  return chunks.map((paragraph) => ({
    ...paragraph,
    content: paragraph.content.map((word) => {
      const currentIndex = index++
      const start =
        currentIndex === 0 ? 0 : previousStart + overlap * segmentDuration
      const end = start + segmentDuration

      previousStart = start

      return {
        ...word,
        index: currentIndex,
        start,
        end,
      }
    }),
  }))
}

export function getTextChunkWordCount(chunks: TextChunks): number {
  return chunks.reduce(
    (count, paragraph) => count + paragraph.content.length,
    0
  )
}

export function getTextChunkCharacterCount(chunks: TextChunks): number {
  return chunks.reduce(
    (count, paragraph) =>
      count +
      paragraph.content.reduce(
        (charCount, word) => charCount + word.content.length,
        0
      ),
    0
  )
}

export type IndexedTextCharacter = {
  char: string
  index: number
  start: number
  end: number
}

export type IndexedTextWordWithCharacters = TextWord & {
  wordIndex: number
  characters: IndexedTextCharacter[]
}

export type IndexedCharacterTextParagraph = {
  type: "paragraph"
  content: IndexedTextWordWithCharacters[]
}

export type IndexedCharacterTextChunks = IndexedCharacterTextParagraph[]

export function buildIndexedCharacterChunks(
  chunks: TextChunks,
  overlap = 0.5
): IndexedCharacterTextChunks {
  const characterCount = getTextChunkCharacterCount(chunks)
  if (characterCount === 0) return []

  const segmentDuration = 1 / ((characterCount - 1) * overlap + 1)

  let charIndex = 0
  let wordIndex = 0
  let previousStart = 0

  return chunks.map((paragraph) => ({
    type: "paragraph" as const,
    content: paragraph.content.map((word) => {
      const characters = [...word.content].map((char) => {
        const currentIndex = charIndex++
        const start =
          currentIndex === 0 ? 0 : previousStart + overlap * segmentDuration
        const end =
          currentIndex === characterCount - 1 ? 1 : start + segmentDuration

        previousStart = start

        return {
          char,
          index: currentIndex,
          start,
          end,
        }
      })

      return {
        ...word,
        wordIndex: wordIndex++,
        characters,
      }
    }),
  }))
}

export type ScrollTextContextValue = {
  scrollYProgress: MotionValue<number>
  animationEndAt: number
}

export const ScrollContext = createContext<ScrollTextContextValue | null>(null)

export function useScrollTextContext() {
  const context = useContext(ScrollContext)

  if (!context) {
    throw new Error(
      "ScrollProgressParagraph components must be used within ScrollProgressParagraph.Root"
    )
  }

  return context
}

export function useScrollContext() {
  return useScrollTextContext().scrollYProgress
}

export function useAnimationProgress() {
  const { scrollYProgress, animationEndAt } = useScrollTextContext()

  return useTransform(scrollYProgress, [0, animationEndAt, 1], [0, 1, 1])
}

export function useScrollWordIndex(
  scrollYProgress: MotionValue<number>,
  wordCount: number
) {
  const [index, setIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (wordCount === 0) return

    setIndex(Math.min(wordCount - 1, Math.floor(latest * wordCount)))
  })

  return index
}

function useScrollTextReveal(start: number, end: number) {
  const progress = useAnimationProgress()

  return {
    width: useTransform(progress, [start, end, 1], ["0%", "100%", "100%"]),
    y: useTransform(progress, [start, end], [100, 0]),
    rotate: useTransform(progress, [start, end], [12, 0]),
    opacity: useTransform(progress, [start, end, 1], [0.25, 1, 1]),
  }
}

export const ScrollTextParagraph = ({
  className,
  ...props
}: HTMLMotionProps<"div">) => {
  return (
    <motion.div className={cn("flex flex-wrap", className)} {...props}>
      {props.children}
    </motion.div>
  )
}

export const ScrollTextCharacter = ({
  start,
  end,
  children,
  className,
  highlight,
  ...props
}: React.ComponentProps<"span"> & {
  start: number
  end: number
  highlight?: boolean
}) => {
  const { width, y, rotate, opacity } = useScrollTextReveal(start, end)

  return (
    <span
      className={cn("relative inline-block overflow-hidden", className)}
      {...props}
    >
      <motion.div style={{ opacity }}>{children}</motion.div>
      <motion.div
        className={cn("absolute top-0 left-0 h-full w-full mix-blend-overlay")}
        style={{
          width,
        }}
      />
    </span>
  )
}

export const ScrollTextWord = ({
  start,
  end,
  children,
  className,
  highlight,
  animateCharacters = false,
  characters,
  ...props
}: React.ComponentProps<"span"> & {
  start?: number
  end?: number
  highlight?: boolean
  animateCharacters?: boolean
  characters?: IndexedTextCharacter[]
}) => {
  if (animateCharacters && characters) {
    return (
      <span className={cn("inline-flex", className)} {...props}>
        {characters.map(({ char, index, start, end }) => (
          <ScrollTextCharacter
            key={index}
            start={start}
            end={end}
            highlight={highlight}
          >
            {char}
          </ScrollTextCharacter>
        ))}
      </span>
    )
  }

  if (start === undefined || end === undefined) {
    throw new Error(
      "ScrollTextWord requires start and end when animateCharacters is false"
    )
  }

  return (
    <ScrollTextWordReveal
      start={start}
      end={end}
      className={className}
      highlight={highlight}
      {...props}
    >
      {children}
    </ScrollTextWordReveal>
  )
}

function ScrollTextWordReveal({
  start,
  end,
  children,
  className,
  highlight,
  ...props
}: React.ComponentProps<"span"> & {
  start: number
  end: number
  highlight?: boolean
}) {
  const { width, y, rotate, opacity } = useScrollTextReveal(start, end)

  return (
    <span className={cn("relative overflow-hidden", className)} {...props}>
      <motion.div style={{ opacity }}>{children}</motion.div>
      <motion.div
        className={cn(
          "absolute top-0 left-0 h-full w-full mix-blend-overlay",
          highlight ? "border-b-[3px]" : "bg-transparent"
        )}
        style={{
          width,
        }}
      />
    </span>
  )
}
