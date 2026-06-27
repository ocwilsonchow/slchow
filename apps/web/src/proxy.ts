import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

const componentsIndexPattern = new RegExp(
  `^(/(?:${routing.locales.join("|")}))?/components/?$`
)

export default function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(componentsIndexPattern)

  if (match) {
    const url = request.nextUrl.clone()
    url.pathname = `${match[1] ?? ""}/components/introduction`
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
