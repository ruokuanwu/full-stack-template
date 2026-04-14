# ─── Stage 1: Install dependencies ────────────────────────────────────────────
FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY app/backend/package.json ./
RUN bun install --production

# ─── Stage 2: Production image ────────────────────────────────────────────────
FROM oven/bun:1-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY app/backend/package.json app/backend/tsconfig.json ./
COPY app/backend/src ./src

# Create data & logs directories
RUN mkdir -p /app/data /app/logs && chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV DB_PATH=/app/data/data.db
ENV LOG_DIR=/app/logs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["bun", "src/index.ts"]
