FROM oven/bun:1.3.14 AS base
WORKDIR /app

FROM base AS prepare
RUN bun add -g turbo@^2
COPY . .
RUN turbo prune api --docker

FROM base AS installer
COPY --from=prepare /app/out/json/ .
RUN bun install --frozen-lockfile
COPY --from=prepare /app/out/full/ .

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3004
COPY --from=installer /app /app
WORKDIR /app/apps/api
EXPOSE 3004
USER bun
CMD ["bun", "run", "src/index.ts"]
