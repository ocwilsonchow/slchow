import { isSstDev, isSstProduction } from "@/lib/stage"

export { getSstStage, isSstDev, isSstProduction } from "@/lib/stage"

export function shouldSendContactDiscord() {
  return isSstProduction() || isSstDev()
}
