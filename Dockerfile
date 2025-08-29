# 1. Use official Bun image to install dependencies
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

# 2. Build Next.js app
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 3. Production image
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY env-inject.sh ./env-inject.sh
RUN chmod +x ./env-inject.sh

EXPOSE 3000

CMD ["sh", "-c", "./env-inject.sh && bun run start"]