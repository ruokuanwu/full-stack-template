# ─── Stage 1: Generate backend type declarations ─────────────────────────────
FROM oven/bun:1-alpine AS types

WORKDIR /app

COPY app/backend/package.json app/backend/
RUN cd app/backend && bun install

COPY app/backend/tsconfig.json app/backend/tsconfig.types.json app/backend/
COPY app/backend/src app/backend/src

RUN cd app/backend && bunx tsc -p tsconfig.types.json

# ─── Stage 2: Build frontend ─────────────────────────────────────────────────
FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY app/frontend/package.json app/frontend/
RUN cd app/frontend && bun install

# Copy shared type bridge
COPY app/shared app/shared

# Copy generated backend types
COPY --from=types /app/app/backend/dist/types app/backend/dist/types

# Copy frontend source and build
COPY app/frontend app/frontend

ARG VITE_API_BASE_URL=/
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN cd app/frontend && bunx vite build

# ─── Stage 3: Serve with nginx ───────────────────────────────────────────────
FROM nginx:1-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/app/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
