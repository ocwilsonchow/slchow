FROM oven/bun:1.3.14-slim
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY src ./src
RUN bunx mastra build
ENV PORT=8080 NODE_ENV=production
EXPOSE 8080
CMD ["bun", ".mastra/output/index.mjs"]