export const resumeVariants = {
  frontend: "resume-v3-frontend",
  "full-stack": "resume-v3-full-stack",
  ai: "resume-v3-ai",
} as const

export type ResumeVariant = keyof typeof resumeVariants

export const publicResumeSlug = resumeVariants["full-stack"]

export const resumeVariantParams = Object.keys(
  resumeVariants
) as ResumeVariant[]

export function isResumeVariant(value: string): value is ResumeVariant {
  return Object.hasOwn(resumeVariants, value)
}
