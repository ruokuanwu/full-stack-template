/**
 * 独立执行迁移脚本
 * 运行：bun src/db/migrate.ts
 */
import { runMigrations } from './index'

try {
    runMigrations()
    console.log('[Migrate] Done.')
    process.exit(0)
} catch (err) {
    console.error('[Migrate] Failed:', err)
    process.exit(1)
}
