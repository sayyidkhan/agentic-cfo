/**
 * Online consistent SQLite backup using better-sqlite3's backup API.
 * Run with: docker compose exec cfo node scripts/backup-sqlite.mjs
 * Restore only while the application is stopped; see docs/ZO_DEPLOYMENT.md.
 */
import Database from 'better-sqlite3'
import { mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const databasePath = process.env.DB_FILE || '/data/agentic-cfo.sqlite'
const backupDirectory = process.env.BACKUP_DIR || '/backups'
try {
  await stat(databasePath)
  await mkdir(backupDirectory, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = join(backupDirectory, `agentic-cfo-${timestamp}.sqlite`)
  const source = new Database(databasePath, { readonly: true, fileMustExist: true })
  try {
    await source.backup(backupPath)
  } finally {
    source.close()
  }
  console.log(`SQLite backup written to ${backupPath}. Keep an additional copy outside this host.`)
} catch (error) {
  console.error('Backup failed:', error instanceof Error ? error.message : 'unknown error')
  process.exitCode = 1
}
