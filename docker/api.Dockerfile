# syntax=docker/dockerfile:1

FROM node:26-bookworm-slim AS base

WORKDIR /app

RUN npm install -g pnpm@10


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install \
    --frozen-lockfile \
    --filter api...


FROM dependencies AS builder

COPY apps/api ./apps/api

RUN pnpm --filter api build


FROM base AS production-dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install \
    --prod \
    --frozen-lockfile \
    --filter api...


FROM node:26-bookworm-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs appuser

COPY --from=production-dependencies \
    /app/node_modules \
    ./node_modules

COPY --from=production-dependencies \
    /app/apps/api/node_modules \
    ./apps/api/node_modules

COPY --from=builder \
    /app/apps/api/dist \
    ./apps/api/dist

COPY --from=builder \
    /app/apps/api/src/database/migrations \
    ./apps/api/dist/database/migrations

COPY --from=builder \
    /app/apps/api/package.json \
    ./apps/api/package.json

USER appuser

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]