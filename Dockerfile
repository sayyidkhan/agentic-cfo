# Portable, single-container AdonisJS 7 / React / SQLite application.
# SQLite is mounted at /data and MUST persist across deployments.
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3333 HOST=0.0.0.0 LOG_LEVEL=info SESSION_DRIVER=cookie DB_FILE=/data/agentic-cfo.sqlite
COPY --from=builder /app/build ./
COPY scripts/backup-sqlite.mjs ./scripts/backup-sqlite.mjs
RUN npm ci --omit=dev && mkdir -p /data /backups && chown -R node:node /app /data /backups
USER node
EXPOSE 3333
CMD ["node", "bin/server.js"]
