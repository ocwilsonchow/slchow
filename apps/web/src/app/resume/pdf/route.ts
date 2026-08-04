import { serveResumePdf } from "@/features/resume/serve-resume-pdf"

export async function GET() {
  return serveResumePdf()
}
