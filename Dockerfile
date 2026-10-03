# Multi-stage Dockerfile optimized for Raspberry Pi (ARM64) and x86_64
FROM node:20-bookworm-slim AS base
WORKDIR /app

# 1. Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

# 2. Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_JELLYFIN_URL
ARG NEXT_PUBLIC_JELLYFIN_TOKEN
ENV NEXT_PUBLIC_JELLYFIN_URL=$NEXT_PUBLIC_JELLYFIN_URL
ENV NEXT_PUBLIC_JELLYFIN_TOKEN=$NEXT_PUBLIC_JELLYFIN_TOKEN
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 3. Production runner
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Flexible startup in case standalone directory is flat or nested
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; elif [ -f freeflix/server.js ]; then node freeflix/server.js; else node .next/standalone/server.js; fi"]