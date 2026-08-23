import { ArrowUpRightIcon } from "lucide-react"
import { useTranslations } from "next-intl"

const works = [
  {
    title: "@mention-editor (npm package)",
    href: "https://editor.slchow.com",
  },
  {
    title: "Agent Luthen",
    href: "https://github.com/ocwilsonchow/agent-luthen",
  },
]

type ListWorksProps = {
  showHeading?: boolean
}

export const ListWorks = ({ showHeading = true }: ListWorksProps) => {
  const t = useTranslations("navigation")
  return (
    <div className="mt-8 flex flex-col gap-2">
      {showHeading ? <h2 className="font-semibold">{t("works")}</h2> : null}
      <ul className="list-disc list-outside ml-4 gap-0.5">
        {works.map((work) => (
          <li key={work.href}>
            <a
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              <span>{work.title}</span>
              <ArrowUpRightIcon
                className="inline-block text-content-subdued"
                size={12}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const linkClassName =
  "block items-baseline space-x-1 text-content-ink py-0.5 px-1.5 font-semibold hover:bg-surface-alpha rounded-md"
