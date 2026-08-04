import { readFile } from "node:fs/promises"
import { join } from "node:path"

const resumeDir = join(process.cwd(), "src/features/resume")

export async function serveResumePdf() {
  const filename = "wilsonchow_resume_015.pdf"
  const buffer = await readFile(join(resumeDir, filename))

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="wilsonchow_resume.pdf"',
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
