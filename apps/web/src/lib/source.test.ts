import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("collections/server", () => ({ docs: [] }))

import { isHiddenSourcePage } from "./source"

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

    expect(isHiddenSourcePage("en/notes/_qna.mdx")).toBe(true)
    expect(isHiddenSourcePage("_qna")).toBe(true)
  })

  it("shows _-prefixed files on local and dev", () => {
    delete process.env.SST_STAGE
    expect(isHiddenSourcePage("en/notes/_qna.mdx")).toBe(false)

    process.env.SST_STAGE = "local"
    expect(isHiddenSourcePage("en/notes/_qna.mdx")).toBe(false)

    process.env.SST_STAGE = "dev"
    expect(isHiddenSourcePage("en/notes/_qna.mdx")).toBe(false)
  })

  it("never hides files without a _ prefix", () => {
    process.env.SST_STAGE = "production"

    expect(isHiddenSourcePage("en/notes/core-javascript-concepts.mdx")).toBe(
      false
    )
  })
})
