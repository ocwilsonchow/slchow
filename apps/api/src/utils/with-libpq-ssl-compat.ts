/** Avoid pg-connection-string deprecation warning for sslmode=require|prefer|verify-ca. */
export function withLibpqSslCompat(connectionString: string) {
  const url = new URL(connectionString)
  if (!url.searchParams.has("uselibpqcompat")) {
    url.searchParams.set("uselibpqcompat", "true")
  }
  return url.toString()
}
