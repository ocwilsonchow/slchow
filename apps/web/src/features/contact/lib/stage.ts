export function getSstStage() {
  return process.env.SST_STAGE || "local"
}

export function isSstProduction() {
  return getSstStage() === "production"
}

export function isSstDev() {
  return getSstStage() === "dev"
}

export function shouldSendContactDiscord() {
  return isSstProduction() || isSstDev()
}
