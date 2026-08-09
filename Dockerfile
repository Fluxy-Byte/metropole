# -------- deps --------
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci \
  && npm install --no-save --no-package-lock lightningcss-linux-x64-gnu@1.29.2

# -------- builder --------
FROM node:20-bookworm-slim AS builder
WORKDIR /app
# ffmpeg + openssl também no build (útil p/ testes e libs que checam no build)
RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg openssl ca-certificates python3 python3-pip \
  && python3 -m pip install --break-system-packages -U yt-dlp \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client (usa os binaryTargets do schema)
RUN npx prisma generate
# Build Next
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -------- runner --------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# ffmpeg + openssl no runtime (ESSENCIAL)
RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg openssl ca-certificates python3 python3-pip \
  && python3 -m pip install --break-system-packages -U yt-dlp \
  && rm -rf /var/lib/apt/lists/*

# Artefatos necessários
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Porta (ajuste se o EasyPanel expõe outra)

EXPOSE 8901

# Aplica migrations e sobe o app
# IMPORTANTE: DATABASE_URL precisa estar como env em runtime no EasyPanel
CMD sh -c "npx prisma migrate deploy && npm run start"