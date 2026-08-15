export function isSstProduction() {
  return process.env.SST_STAGE === "production"
}
