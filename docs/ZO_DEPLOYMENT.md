# Zo Computer deployment handoff (AdonisJS + SQLite)

**Status:** Deployment configuration and backup tooling committed; **not deployed to Zo yet**. No Zo account/session or AI keys have been accessed.

## Prerequisites
A Zo Computer environment that can run Docker Compose and persist Docker volumes, with a secure HTTPS reverse proxy/hostname. If Docker isn't supported in your Zo plan, use the same Node 24 build directly and set `DB_FILE` to a persistent writable path.

The app requires Node.js **24+**. It serves React/Inertia and backend API routes in **one process**, without a separate frontend server or managed database.

## Deploy with Docker Compose
1. Clone `https://github.com/sayyidkhan/agentic-cfo` in your Zo environment.
2. Copy `.env.example` to `.env` and set your real `APP_KEY` (generate with `node ace generate:key` on a trusted machine or use a securely generated compatible key), `APP_URL`, and other required values. Never commit `.env`.
3. Set `APP_URL` to the actual HTTPS origin users will browse; configure Zo's proxy to forward to local TCP port 3333. Compose listens on `127.0.0.1:3333` by default and assumes an external TLS proxy.
4. Build the container, run migrations, then start the service:

```bash
docker compose build
docker compose run --rm cfo node ace migration:run --force
docker compose up -d
docker compose ps
```

If the app is already running, back up the database **before** a migration. Avoid concurrent migrations or two app instances writing the same SQLite database.

## Persistence
The `cfo-data` Docker volume holds `/data/agentic-cfo.sqlite` (plus its WAL and SHM files). Do not remove that volume during upgrades; `docker compose down --volumes` will delete it.

`cfo-backups` is a separate named volume containing `/backups` for consistent online snapshots.

Backup while the app is running:
```bash
docker compose exec cfo node scripts/backup-sqlite.mjs
```

Copy a backup off the host; a backup on the same machine is **not** disaster recovery:
```bash
# Replace timestamped filename using output from the backup command.
docker compose cp cfo:/backups/agentic-cfo-YYYY-MM-DDTHH-MM-SS-MMMZ.sqlite ./agentic-cfo-backup.sqlite
```

For restoration, stop the app first, preserve the existing DB file separately, replace `/data/agentic-cfo.sqlite` with a verified backup, ensure permissions are correct, then restart. Test restoration in a separate environment before relying on this process.

## AI conversation (optional)
Set `CFO_AI_API_KEY`, `CFO_AI_MODEL`, and optionally `CFO_AI_BASE_URL` in the server's secret environment. The model must support Chat Completions function calling.

Without these values, the budgeting, wealth, goals and financial-risk views work, but CFO chat is disabled. The key never belongs in the frontend. Financial snapshots and chats are sent to the selected model provider when chat is enabled; assess provider privacy terms before entering real data.

## Boundaries
- Each deployment keeps its own independent SQLite database; there is no built-in sync between ChatGPT-assisted development and Zo.
- Disable public access while completing security review, browser verification and backups.
- Do not assume Zo automatically exposes a durable volume, sends backups off host, or supports custom Docker images; validate these features in that specific environment.
- This document is a repeatable deployment recipe, **not a claim that Zo has been deployed or tested**.
