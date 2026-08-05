# slchow.com

Personal site for [Wilson Chow](https://slchow.com) — notes, works, resume, and contact — built as a Bun + Turborepo monorepo and deployed to AWS with SST / OpenNext.

**Live:** [slchow.com](https://slchow.com) · **Dev:** [dev.slchow.com](https://dev.slchow.com)

## Stack

- [Next.js](https://nextjs.org/) (App Router) + React 19 + Tailwind CSS 4
- [next-intl](https://next-intl.dev/) for `en` / `hk` / `cn`
- [Fumadocs MDX](https://www.fumadocs.dev/) for notes, works, and content blocks
- [SST](https://sst.dev/) + [OpenNext](https://open-next.js.org/) on AWS (`ap-east-1`)
- [Turborepo](https://turborepo.dev/) for workspace tasks
- [Biome](https://biomejs.dev/) for lint/format in `apps/web`
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) for pre-commit checks
- [Playwright](https://playwright.dev/) + axe for production and a11y smoke checks

## Structure

```text
apps/
  web/          Next.js site (localhost:3003)
  api/          Reserved (empty for now)
packages/
  content/      MDX source (en / hk / cn: notes, works, blocks)
  ds/           Shared design system (@repo/ds)
  intl/         next-intl message catalogs (@repo/intl)
scripts/        Production verify + a11y smoke
sst.config.ts   AWS / domain / OpenNext config
```

## Requirements

- Node.js 22+
- [Bun](https://bun.sh/)
- AWS SSO profile `sinlongchow` (for deploy / `sst dev` cloud resources)

## Setup

```sh
bun install          # also installs Husky git hooks via prepare
bun run sso          # aws sso login --sso-session=sinlongchow
bun dev              # sst dev --stage local → http://localhost:3003
```

Pre-commit runs lint-staged: Biome on staged `apps/web` files, Prettier on other staged `ts` / `tsx` / `md` / `json`.

## Scripts

| Command                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `bun dev`                   | SST local stage; runs the Next.js app on port 3003 |
| `bun run build`             | Turbo build across workspaces                      |
| `bun run lint`              | Turbo lint                                         |
| `bun run check-types`       | Turbo typecheck                                    |
| `bun run format`            | Prettier across `ts` / `tsx` / `md`                |
| `bun run deploy:dev`        | Deploy to `dev` stage (`dev.slchow.com`)           |
| `bun run deploy`            | Deploy to `production` (`slchow.com`)              |
| `bun run deploy:production` | Production deploy + Playwright verify              |
| `bun run verify:production` | Crawl production sitemap and check pages           |
| `bun run a11y:smoke`        | axe-core smoke against key routes                  |
| `bun run sso`               | Refresh AWS SSO session                            |

## Content & locales

MDX lives in `packages/content/src/{en,hk,cn}/` under `notes/`, `works/`, and `blocks/`. UI copy is in `packages/intl/messages/{en,hk,cn}.json`. The web app loads content through Fumadocs (`apps/web/source.config.ts`).

## Deploy

Infrastructure is defined in `sst.config.ts`:

- App name: `oc2`
- Production domain: `slchow.com` (www → apex)
- Non-production domain: `dev.slchow.com`
- Production keeps one warm OpenNext server instance; other stages use `warm: 0`
