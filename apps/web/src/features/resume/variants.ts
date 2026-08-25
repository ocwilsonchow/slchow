export const resumeVariants = {
  frontend: "resume-v4-frontend",
  "full-stack": "resume-v5-full-stack",
} as const

export type ResumeVariant = keyof typeof resumeVariants

export const publicResumeVariant = "full-stack" satisfies ResumeVariant

export const publicResumeSlug = resumeVariants[publicResumeVariant]

export const resumeVariantParams = Object.keys(
  resumeVariants
) as ResumeVariant[]

export function isResumeVariant(value: string): value is ResumeVariant {
  return Object.hasOwn(resumeVariants, value)
}
