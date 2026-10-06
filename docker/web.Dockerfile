# syntax=docker/dockerfile:1

FROM node:26-bookworm-slim AS base

WORKDIR /app

RUN npm install -g pnpm@10


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install \
    --frozen-lockfile \
    --filter web...


FROM dependencies AS builder

ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY apps/web ./apps/web

RUN pnpm --filter web build


FROM node:26-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/apps/web/public \
    ./apps/web/public

COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/apps/web/.next/standalone \
    ./

COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/apps/web/.next/static \
    ./apps/web/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]