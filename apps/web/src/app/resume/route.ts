import { type NextRequest, NextResponse } from "next/server"

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/resume-full-stack.pdf", request.url), 308)
}
