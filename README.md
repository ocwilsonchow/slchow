![slchow.com](https://slchow.com/og-image-02.png)

# slchow.com

Personal site — notes, works, designs, resume, and contact — plus a Hono / Mastra API for agents and auth. Bun + Turborepo monorepo, deployed to AWS with SST / OpenNext.

**Live:** [slchow.com](https://slchow.com) · **Dev:** [dev.slchow.com](https://dev.slchow.com) (Basic Auth)

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19 + Tailwind CSS 4
- [next-intl](https://next-intl.dev/) for `en` / `hk` / `cn`
- [Fumadocs](https://www.fumadocs.dev/) MDX for notes, works, and content blocks
- [Orama](https://orama.com/) (via Fumadocs) for client-side full-text search
- [Hono](https://hono.dev/) + [Mastra](https://mastra.ai/) API (agents, workflows, OpenAPI)
- [Better Auth](https://www.better-auth.com/) + [Drizzle](https://orm.drizzle.team/) / Postgres
- [TanStack Query](https://tanstack.com/query) + [AI SDK](https://ai-sdk.dev/) on the web client
- [SST](https://sst.dev/) + [OpenNext](https://open-next.js.org/) on AWS (`ap-east-1`)
- [PostHog](https://posthog.com/) for page visits / autocapture (production only; client SDK + `/ingest` proxy)
- Shared CloudFront [`Router`](https://sst.dev/docs/component/aws/router/) fronts the site (and future API subdomains)
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
  content/      MDX + design assets (en / hk / cn)
  ds/           Shared design system (@repo/ds)
  intl/         next-intl message catalogs (@repo/intl)
  auth/         Better Auth server + client (@repo/auth)
  db/           Drizzle schema + migrations (@repo/db)
  infra/        SST resources
    router.ts   Shared CloudFront Router (domain, Basic Auth, WAF)
    nextjs.ts   OpenNext site → attaches to Router
    api.ts      ECS API → routes on api.* via Router (opt-in)
    domain.ts   Host helpers (site / api / app / mastra)
scripts/        Production verify + a11y smoke
sst.config.ts   App entry — currently wires @repo/infra/nextjs
```

### Web app features (`apps/web`)

| Area    | Notes                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Routes  | Home, resume, notes, works, designs, contact (locale-prefixed)                                                                     |
| Content | Fumadocs MDX from `@repo/content`                                                                                                  |
| Search  | ⌘/Ctrl+K; indexes notes, works, and current resume                                                                                 |
| Designs | Album stacks (stills + in-view MP4); synced from `packages/content/design` → `public/design-assets` with 200/320/400/800w variants |
| Motion  | Lenis smooth scroll + Motion / GSAP-friendly layout                                                                                |
| i18n    | `en`, `hk`, `cn` via next-intl + Fumadocs                                                                                          |

## Requirements

- Node.js 22+
- [Bun](https://bun.sh/) (`1.3.14`)
- AWS SSO profile matching `sst.config.ts` (for deploy / `sst dev` cloud resources)
- SST secrets for API/auth/db when running those stacks: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `AI_GATEWAY_API_KEY`
- Non-prod CloudFront Basic Auth secrets: `USERNAME`, `PASSWORD` (via `@repo/infra/secrets`)
- PostHog analytics (page visits): production only. Set `bunx sst secret set POSTHOG_PROJECT_TOKEN phc_... --stage production` after creating a [PostHog Cloud](https://app.posthog.com) project. The secret is linked to the Next.js site and read via `Resource.POSTHOG_PROJECT_TOKEN` (not initialized on local/dev). If the project API key was exposed outside PostHog/SST, rotate it in PostHog project settings and re-run `sst secret set` for production.

## Setup

```sh
bun install          # also installs Husky git hooks via prepare
bun run sso          # refresh AWS SSO session
bunx sst secret set POSTHOG_PROJECT_TOKEN phc_... --stage production   # PostHog (prod only)
bun dev              # sst dev --stage local → http://localhost:3003
```

`apps/web` `predev` / `build` sync design assets (and write 200/320/400/800w variants), run `fumadocs-mdx`, and generate Orama search indexes into `public/search-index/` (gitignored).

Pre-commit runs lint-staged: Biome (`check --write`) on staged `apps/web` JS/TS/JSON/CSS, Prettier on other staged `ts` / `tsx` / `md` / `mts` / `json`.

### Database (local)

With SST local stage secrets available:

```sh
bun run db:generate
bun run db:migrate   # or bun run db:push
bun run db:studio
bun run auth:generate   # regenerate Better Auth tables into @repo/db
```

## Scripts

| Command                     | Description                                 |
| --------------------------- | ------------------------------------------- |
| `bun dev`                   | SST local stage; Next.js on port 3003       |
| `bun run build`             | Turbo build across workspaces               |
| `bun run lint`              | Turbo lint                                  |
| `bun run check-types`       | Turbo typecheck                             |
| `bun run format`            | Prettier across `ts` / `tsx` / `md`         |
| `bun run format:check`      | Prettier check (used in CI)                 |
| `bun run kill:ports`        | Free common local ports                     |
| `bun run deploy:dev`        | Deploy to `dev` stage (`dev.slchow.com`)    |
| `bun run deploy`            | Deploy to `production` (`slchow.com`)       |
| `bun run deploy:production` | Production deploy + Playwright verify       |
| `bun run verify:production` | Crawl production sitemap and check pages    |
| `bun run a11y:smoke`        | axe-core smoke against key routes + search  |
| `bun run sso`               | Refresh AWS SSO session                     |
| `bun run db:*`              | Drizzle generate / migrate / push / studio  |
| `bun run auth:generate`     | Generate Better Auth schema into `@repo/db` |

**Web-only helpers** (from `apps/web`):

| Command                          | Description                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| `bun run build:search-index`     | Write `public/search-index/{locale}.json`                                                |
| `bun run sync:design-assets`     | Copy design files into `public/design-assets` and write 200/320/400/800w variants        |
| `bun run optimize:design-assets` | Optimize stills with Sharp; transcode MOV/MP4 to H.264 + WebP poster (`ffmpeg` required) |

**CI:** GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to `main` / `develop`. It runs `bun install --frozen-lockfile`, `lint`, `format:check`, `check-types`, and `build`. On completion it posts status to Discord via the `DISCORD_WEBHOOK` repository secret.

## Content & locales

MDX lives in `packages/content/src/{en,hk,cn}/` under `notes/`, `works/`, and `blocks/`. Design source stills and videos live in `packages/content/design/`. UI copy is in `packages/intl/messages/{en,hk,cn}.json`. The web app loads content through Fumadocs (`apps/web/source.config.ts`).

## Designs

The `/design` page is a gallery of albums. Each folder under `packages/content/design/{slug}/` is one album. Collapsed cards fan the first four assets; opening an album overlays a grid (Motion `layoutId`). Videos are muted looping MP4s that play when in view (off under `prefers-reduced-motion`).

Drop stills (any raster) and videos (MOV/MP4) into a slug folder, then from `apps/web`:

1. `bun run optimize:design-assets` — Sharp WebP stills (max 2048); ffmpeg transcodes MOV/MP4 to H.264 (max 1920, no audio) plus a matching WebP poster. Requires `ffmpeg` (`brew install ffmpeg`). Manual; not part of `predev` / build.
2. `bun run sync:design-assets` — copies into `public/design-assets` and writes `.w200.webp` / `.w320.webp` / `.w400.webp` / `.w800.webp` variants. Runs on `predev`, `prebuild`, and the OpenNext `buildCommand`.

A video `foo.mp4` is paired with `foo.webp` as poster; that poster is not listed as a separate still. Runtime uses native `img` / `video` (no `/_next/image`) with a 200/320/400/800/2048 srcset.

```text
packages/content/design/{slug}/still.webp     →   still.w200.webp, still.w320.webp, still.w400.webp, still.w800.webp
packages/content/design/{slug}/motion.mp4     →   motion.webp poster (not a gallery still)
```

## Search

Instant full-text search over **notes**, **works**, and the current resume (`blocks/resume-v2`), with a shared Unicode tokenizer for English and CJK.

Indexes are built at compile time (`apps/web/scripts/build-search-index.ts`) and served as static files:

```text
public/search-index/{en,hk,cn}.json   →   /search-index/{locale}.json
```

The client loads the locale file from the CDN (OpenNext assets behind the shared Router). This avoids shipping the Orama dump through a Lambda route handler — large JSON responses exceed AWS Lambda’s sync payload limit and break `/api/search` on OpenNext.

Open with ⌘/Ctrl+K or the header search trigger.

## API

`apps/api` is a Hono app with Mastra agents/workflows, Better Auth, OpenAPI / Scalar docs, and health routes. Locally it serves on `http://localhost:4111` (Mastra Studio can use port `4111` via `bun run studio` in `apps/api`).

SST API infrastructure lives in `@repo/infra/api` (ECS service on the shared Router):

| Stage      | API host                 |
| ---------- | ------------------------ |
| production | `api.slchow.com`         |
| other      | `api.{stage}.slchow.com` |

It is defined but not imported from `sst.config.ts` yet — uncomment `await import("@repo/infra/api")` when ready to deploy the API stack.

## Infrastructure & deploy

`sst.config.ts` loads `@repo/infra/nextjs`, which pulls in the shared Router.

```text
Client → CloudFront Router → OpenNext (site)
                          └→ API / Lambda (later, via api.* subdomain)
```

|              | Production       | Non-production (e.g. `dev`) |
| ------------ | ---------------- | --------------------------- |
| Site         | `slchow.com`     | `{stage}.slchow.com`        |
| Alias        | `*.slchow.com`   | `*.{stage}.slchow.com`      |
| Redirect     | `www` → apex     | —                           |
| Basic Auth   | off              | on (Router viewer-request)  |
| WAF          | on (`waf: true`) | off                         |
| Warm servers | 1                | 0                           |

- App name: `oc2`
- Region: `ap-east-1` (profile from `sst.config.ts`); CloudFront WAF resources are created in `us-east-1`
- Next.js uses `router: { instance }` — no separate site CloudFront distribution
- Host helpers live in `@repo/infra/domain` (`siteHost`, `apiHost`, `appHost`, `mastraHost`)
- OpenNext `buildCommand` syncs design assets, then runs `bun run build` (MDX + search indexes + `next build`)

After CDN / domain changes, deploy **dev** first, smoke-test Basic Auth and routes, then production. Route 53 alias updates are usually fast; CloudFront rollout and DNS caches often take **~5–20 minutes**.

```sh
bun run deploy:dev          # → https://dev.slchow.com
bun run deploy              # → https://slchow.com
bun run deploy:production   # production + verify:production
```
