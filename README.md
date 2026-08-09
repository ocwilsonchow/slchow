![hey i'm wilson](./banner.jpg)

# slchow.com

Personal site for [Wilson Chow](https://slchow.com) — notes, works, resume, and contact — plus a Hono / Mastra API for agents and auth. Bun + Turborepo monorepo, deployed to AWS with SST / OpenNext.

**Live:** [slchow.com](https://slchow.com) · **Dev:** [dev.slchow.com](https://dev.slchow.com)

## Stack

- [Next.js](https://nextjs.org/) (App Router) + React 19 + Tailwind CSS 4
- [next-intl](https://next-intl.dev/) for `en` / `hk` / `cn`
- [Fumadocs MDX](https://www.fumadocs.dev/) for notes, works, and content blocks
- [Hono](https://hono.dev/) + [Mastra](https://mastra.ai/) API (agents, workflows, OpenAPI)
- [Better Auth](https://www.better-auth.com/) + [Drizzle](https://orm.drizzle.team/) / Postgres
- [TanStack Query](https://tanstack.com/query) + [AI SDK](https://ai-sdk.dev/) on the web client
- [SST](https://sst.dev/) + [OpenNext](https://open-next.js.org/) on AWS (`ap-east-1`)
- [Turborepo](https://turborepo.dev/) for workspace tasks
- [Biome](https://biomejs.dev/) for lint/format in `apps/web`
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) for pre-commit checks
- [Playwright](https://playwright.dev/) + axe for production and a11y smoke checks

## Structure

```text
apps/
  web/          Next.js site (localhost:3003)
  api/          Hono + Mastra API (localhost:4111)
packages/
  content/      MDX source (en / hk / cn: notes, works, blocks)
  ds/           Shared design system (@repo/ds)
  intl/         next-intl message catalogs (@repo/intl)
  auth/         Better Auth server + client (@repo/auth)
  db/           Drizzle schema + migrations (@repo/db)
  infra/        SST resources (Next.js, API, VPC, secrets, …)
scripts/        Production verify + a11y smoke
sst.config.ts   App entry — currently wires @repo/infra/nextjs
```

## Requirements

- Node.js 22+
- [Bun](https://bun.sh/) (`1.3.14`)
- AWS SSO profile `sinlongchow` (for deploy / `sst dev` cloud resources)
- SST secrets for API/auth/db when running those stacks: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `AI_GATEWAY_API_KEY`

## Setup

```sh
bun install          # also installs Husky git hooks via prepare
bun run sso          # aws sso login --sso-session=sinlongchow
bun dev              # sst dev --stage local → http://localhost:3003
```

Pre-commit runs lint-staged (Prettier on staged `ts` / `tsx` / `md` / `mts` / `json`).

### Database (local)

With SST local stage secrets available:

```sh
bun run db:generate
bun run db:migrate   # or bun run db:push
bun run db:studio
bun run auth:generate   # regenerate Better Auth tables into @repo/db
```

## Scripts

| Command                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `bun dev`                   | SST local stage; Next.js on port 3003              |
| `bun run build`             | Turbo build across workspaces                      |
| `bun run lint`              | Turbo lint                                         |
| `bun run check-types`       | Turbo typecheck                                    |
| `bun run format`            | Prettier across `ts` / `tsx` / `md`                |
| `bun run format:check`      | Prettier check (used in CI)                        |
| `bun run kill:ports`        | Free common local ports                            |
| `bun run deploy:dev`        | Deploy to `dev` stage (`dev.slchow.com`)           |
| `bun run deploy`            | Deploy to `production` (`slchow.com`)              |
| `bun run deploy:production` | Production deploy + Playwright verify              |
| `bun run verify:production` | Crawl production sitemap and check pages           |
| `bun run a11y:smoke`        | axe-core smoke against key routes                  |
| `bun run sso`               | Refresh AWS SSO session                            |
| `bun run db:*`              | Drizzle generate / migrate / push / studio         |
| `bun run auth:generate`     | Generate Better Auth schema into `@repo/db`        |

**CI:** GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to `main` / `develop`. It runs `bun install --frozen-lockfile`, `lint`, `format:check`, `check-types`, and `build`. On completion it posts status to Discord via the `DISCORD_WEBHOOK` repository secret.

## Content & locales

MDX lives in `packages/content/src/{en,hk,cn}/` under `notes/`, `works/`, and `blocks/`. UI copy is in `packages/intl/messages/{en,hk,cn}.json`. The web app loads content through Fumadocs (`apps/web/source.config.ts`).

## API

`apps/api` is a Hono app with Mastra agents/workflows, Better Auth, OpenAPI / Scalar docs, and health routes. Locally it serves on `http://localhost:4111` (Mastra Studio can use port `4111` via `bun run studio` in `apps/api`).

SST API infrastructure lives in `@repo/infra/api` (ECS service + router on `api.slchow.com` / `{stage}.api.slchow.com`). It is defined but not imported from `sst.config.ts` yet — uncomment `await import("@repo/infra/api")` when ready to deploy the API stack.

## Deploy

Infrastructure modules live under `packages/infra/`; `sst.config.ts` currently loads Next.js only:

- App name: `oc2`
- Production domain: `slchow.com` (www → apex)
- Non-production domain: `{stage}.slchow.com` (e.g. `dev.slchow.com`)
- Production keeps one warm OpenNext server instance; other stages use `warm: 0`
- Region: `ap-east-1`, AWS profile `sinlongchow`
