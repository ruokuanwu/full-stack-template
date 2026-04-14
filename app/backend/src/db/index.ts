import { Database } from 'bun:sqlite'
import { config } from '@/config'
import {
    CREATE_USERS_TABLE,
    CREATE_REFRESH_TOKENS_TABLE,
    CREATE_AUDIT_LOGS_TABLE,
    CREATE_INDEXES,
} from './schema'

// 创建单例数据库连接
const db = new Database(config.dbPath, { create: true })

// 启用 WAL 模式以提高并发性能
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')
db.exec('PRAGMA synchronous = NORMAL')

/**
 * 运行所有建表和建索引 DDL（幂等）
 */
export function runMigrations(): void {
    db.transaction(() => {
        db.exec(CREATE_USERS_TABLE)
        db.exec(CREATE_REFRESH_TOKENS_TABLE)
        db.exec(CREATE_AUDIT_LOGS_TABLE)
        for (const idx of CREATE_INDEXES) {
            db.exec(idx)
        }
    })()

    console.log('[DB] Migrations completed.')
}

export { db }
