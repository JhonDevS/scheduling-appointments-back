FROM node:22.21.1-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod

FROM node:22.21.1-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY package.json pnpm-lock.yaml* ./

COPY --from=deps /app/node_modules ./node_modules

RUN pnpm install --frozen-lockfile

COPY src/ ./src/

FROM node:22.21.1-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --spider -q http://localhost:3000/api/v1/health || exit 1

CMD ["node", "src/server.js"]