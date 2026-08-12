export const domain = "slchow.com"

export function siteHost(stage: string) {
  return stage === "production" ? domain : `${stage}.${domain}`
}

export function apiHost(stage: string) {
  return stage === "production" ? `api.${domain}` : `api.${stage}.${domain}`
}

export function appHost(stage: string) {
  return stage === "production" ? `app.${domain}` : `app.${stage}.${domain}`
}

export function mastraHost(stage: string) {
  return stage === "production"
    ? `mastra.${domain}`
    : `mastra.${stage}.${domain}`
}
