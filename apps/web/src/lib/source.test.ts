import { afterEach, describe, expect, it } from "vitest"
import {
  isDraftSourcePage,
  isFullStackQaSection,
  isHiddenSourcePage,
  isPinnedSourcePage,
  stripPinPrefix,
} from "./source-hidden"

describe("isDraftSourcePage", () => {
  it("matches _-prefixed files on every stage", () => {
    expect(isDraftSourcePage("en/notes/_full-stack-qa-api.mdx")).toBe(true)
    expect(isDraftSourcePage("_frontend-regression-test")).toBe(true)
    expect(isDraftSourcePage("en/notes/full-stack-qa.mdx")).toBe(false)
    expect(isDraftSourcePage("en/notes/core-javascript-concepts.mdx")).toBe(
      false
    )
  })
})

describe("isHiddenSourcePage", () => {
  const original = process.env.SST_STAGE

  afterEach(() => {
    if (original === undefined) {
      delete process.env.SST_STAGE
    } else {
      process.env.SST_STAGE = original
    }
  })

  it("hides _-prefixed files on production", () => {
    process.env.SST_STAGE = "production"

    expect(isHiddenSourcePage("en/notes/_full-stack-qa-api.mdx")).toBe(true)
    expect(isHiddenSourcePage("_full-stack-qa-api")).toBe(true)
    expect(isHiddenSourcePage("en/notes/full-stack-qa.mdx")).toBe(false)
    expect(isHiddenSourcePage("full-stack-qa")).toBe(false)
  })

  it("does not unpublish _-prefixed files on local and dev", () => {
    delete process.env.SST_STAGE
    expect(isHiddenSourcePage("en/notes/_full-stack-qa-api.mdx")).toBe(false)

    process.env.SST_STAGE = "local"
    expect(isHiddenSourcePage("en/notes/_full-stack-qa-api.mdx")).toBe(false)

    process.env.SST_STAGE = "dev"
    expect(isHiddenSourcePage("en/notes/_full-stack-qa-api.mdx")).toBe(false)
  })

  it("never hides files without a _ prefix", () => {
    process.env.SST_STAGE = "production"

    expect(isHiddenSourcePage("en/notes/full-stack-qa.mdx")).toBe(false)
    expect(isHiddenSourcePage("en/notes/core-javascript-concepts.mdx")).toBe(
      false
    )
  })
})

describe("isPinnedSourcePage", () => {
  it("matches *-prefixed filenames", () => {
    expect(
      isPinnedSourcePage("en/notes/*javascript-event-loop-in-depth.mdx")
    ).toBe(true)
    expect(isPinnedSourcePage("*understanding-react-in-depth")).toBe(true)
  })

  it("does not match unpinned files", () => {
    expect(isPinnedSourcePage("en/notes/core-javascript-concepts.mdx")).toBe(
      false
    )
    expect(isPinnedSourcePage("javascript-event-loop-in-depth")).toBe(false)
  })
})

describe("stripPinPrefix", () => {
  it("strips a leading * from a slug or filename stem", () => {
    expect(stripPinPrefix("*javascript-event-loop-in-depth")).toBe(
      "javascript-event-loop-in-depth"
    )
    expect(stripPinPrefix("*javascript-event-loop-in-depth.mdx")).toBe(
      "javascript-event-loop-in-depth.mdx"
    )
  })

  it("leaves unpinned segments unchanged", () => {
    expect(stripPinPrefix("javascript-event-loop-in-depth")).toBe(
      "javascript-event-loop-in-depth"
    )
  })
})

describe("isFullStackQaSection", () => {
  it("matches section files, not the combined note", () => {
    expect(isFullStackQaSection("en/notes/_full-stack-qa-api.mdx")).toBe(true)
    expect(isFullStackQaSection("_full-stack-qa-javascript")).toBe(true)
    expect(isFullStackQaSection("en/notes/full-stack-qa.mdx")).toBe(false)
    expect(isFullStackQaSection("full-stack-qa")).toBe(false)
  })
})
