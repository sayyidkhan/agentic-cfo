# Deploy Agentic CFO to Zo Computer — Node Service, no Docker

**Status:** Repo contains a deployable Node/AdonisJS application and preparation script. Actual Zo instance not deployed or accessed in this conversation.

## Recommended target

Use **Zo Computer → Services → HTTP service** for the AdonisJS Node server, rather than Zo Sites (which favours Hono/Bun-based projects). Zo Services supports long-running programs with an entrypoint, working directory and port. You can initially keep the service **private**.

Zo documentation: https://www.zo.computer/guide/hosting

## Required runtime
- Node.js 24+ and npm, with ability to run native better-sqlite3 dependency.
- One Node server and one *persistent writable folder* for the SQLite database; no Docker, VPS or separate database server.
- A Zo HTTPS URL mapped to the service, with an appropriately configured APP_URL.
- Server-only environment variables for APP_KEY, credentials, DB_FILE and other settings.

## Initial setup

1. Clone or pull `https://github.com/sayyidkhan/agentic-cfo` on your Zo computer.
2. Confirm Node.js 24+, then run from the repository root:

```bash
bash scripts/zo-build.sh
```

This installs dependencies, typechecks, compiles the standalone build and installs its production-only dependencies. Use the `build/` output for the **running** process.

3. Create a persistent data directory outside the repository and build folder, for example `$HOME/agentic-cfo-data`:

```bash
mkdir -p "$HOME/agentic-cfo-data" "$HOME/agentic-cfo-backups"
```

4. In the Zo Service configuration, provide secrets and settings **as environment variables** (do not commit `.env`):

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
APP_URL=https://<your-zo-https-domain>
APP_KEY=<random-generated-and-kept-secret>
SESSION_DRIVER=cookie
DB_FILE=/absolute/persistent/path/agentic-cfo.sqlite
CFO_ALLOW_SIGNUP=false
# No AI key is needed for guided CFO mode.
# Optional direct API only if separately authorised and billed:
CFO_AI_API_KEY=
CFO_AI_MODEL=
CFO_AI_BASE_URL=https://api.openai.com/v1
```

Replace sample paths and hostnames. Set `DB_FILE` to an **absolute path** in Zo's persistent storage, not inside `build`, `tmp`, or a folder Zo deletes/recreates. Run `node ace generate:key` in a trusted local/source setup to obtain APP_KEY; keep the same key across redeployments.

5. Before first startup, run schema migrations in the *compiled* build directory with the same server environment:

```bash
cd build
NODE_ENV=production node ace migration:run --force
```

6. Register a Zo **HTTP Service**:
   - **Working directory:** absolute path to `agentic-cfo/build`
   - **Entrypoint/command:** `node bin/server.js`
   - **Port:** `3333` (or match PORT)
   - **Access:** private at first
   - **Restart policy:** managed by Zo Services

Zo handles the service lifecycle. No `pm2`, `nohup`, Docker or extra proxy is assumed. Configure APP_URL to the actual HTTPS host Zo assigns.

7. To create your **first account**, temporarily set `CFO_ALLOW_SIGNUP=true`, restart the service, complete registration, then switch it back to `false` and restart. Until browser/security review is complete, do not use genuine sensitive financial data.

## Updates

From the repository root, back up SQLite first, pull new code, rerun `bash scripts/zo-build.sh`, stop the service, run new compiled migrations, and restart. Keep DB_FILE and APP_KEY stable. New builds do not migrate or copy financial records automatically.

## Consistent SQLite backup

Run in the repository root while DB_FILE points to the *same* persistent DB as the application:

```bash
DB_FILE=/absolute/path/agentic-cfo.sqlite \
BACKUP_DIR=/absolute/path/offline-backups \
node scripts/backup-sqlite.mjs
```

The script uses SQLite's online backup API rather than copying a live WAL database unsafely. Keep an encrypted **off-host** copy and test a restore in a separate instance. On restore, stop the Zo Service, save the existing DB elsewhere, restore a known-good backed-up SQLite file with correct permissions and restart.

## ChatGPT Sites

ChatGPT Sites is a different runtime from Zo's Node Services and is **not** a drop-in deployment for the current AdonisJS server. See [SITES_COMPATIBILITY.md](SITES_COMPATIBILITY.md).

## Remaining release gates

Browser journey and user-isolation verification, real model-provider testing, persistent-storage check on Zo, and security/privacy review still need evidence. This is a deployment **recipe**, not a claim that the service has been deployed.
