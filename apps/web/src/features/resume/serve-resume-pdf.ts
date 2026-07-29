import { readFile } from "node:fs/promises"
import { join } from "node:path"

const resumeDir = join(process.cwd(), "src/assets/resume")

type ResumeTheme = "dark" | "light"

export async function serveResumePdf(theme: ResumeTheme) {
  const filename = `resume_${theme}.pdf`
  const buffer = await readFile(join(resumeDir, filename))

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
