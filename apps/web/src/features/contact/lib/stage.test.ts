import { afterEach, describe, expect, it } from "vitest"
import {
  getSstStage,
  isSstDev,
  isSstProduction,
  shouldSendContactDiscord,
} from "./stage"

describe("contact stage", () => {
  const original = process.env.SST_STAGE

  afterEach(() => {
    if (original === undefined) {
      delete process.env.SST_STAGE
    } else {
      process.env.SST_STAGE = original
    }
  })

  it("treats a missing SST_STAGE as local and does not send Discord", () => {
    delete process.env.SST_STAGE

    expect(getSstStage()).toBe("local")
    expect(isSstProduction()).toBe(false)
    expect(isSstDev()).toBe(false)
    expect(shouldSendContactDiscord()).toBe(false)
  })

  it("sends Discord on the dev and production stages", () => {
    process.env.SST_STAGE = "dev"
    expect(isSstDev()).toBe(true)
    expect(shouldSendContactDiscord()).toBe(true)

    process.env.SST_STAGE = "production"
    expect(isSstProduction()).toBe(true)
    expect(shouldSendContactDiscord()).toBe(true)
  })
})
