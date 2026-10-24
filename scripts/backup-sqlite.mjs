/**
 * SQLite's online backup API produces a consistent snapshot while the app is running.
 * Run: DB_FILE=/absolute/path/app.sqlite node scripts/backup-sqlite.mjs
 * Copy backup to separate off-host storage. Do not commit it to GitHub.
 */
import Database from 'better-sqlite3'
import { mkdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const dbFile = process.env.DB_FILE
if (!dbFile) {
  console.error('Set DB_FILE to the same persistent SQLite file used by your running application.')
  process.exit(1)
}
const backupDirectory = resolve(process.env.BACKUP_DIR || './backups')
try {
  const databasePath = resolve(dbFile)
  await stat(databasePath)
  if (backupDirectory === databasePath) throw new Error('Backup path cannot equal database path')
  await mkdir(backupDirectory, { recursive: true, mode: 0o700 })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = join(backupDirectory, `agentic-cfo-${timestamp}.sqlite`)
  const source = new Database(databasePath, { readonly: true, fileMustExist: true })
  try {
    await source.backup(backupPath)
  } finally {
    source.close()
  }
  console.log(`SQLite backup created: ${backupPath}`)
  console.log('Copy it off host and test a restore before trusting it.')
} catch (error) {
  console.error('Backup failed:', error instanceof Error ? error.message : 'unknown error')
  process.exitCode = 1
}
