import { mkdirSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { config } from '@/config'

// ─── 日志级别 ─────────────────────────────────────────────────────────────────

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const
type Level = keyof typeof LEVELS

const COLORS: Record<Level, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m', // green
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
}
const RESET = '\x1b[0m'

// ─── 日志目录 ─────────────────────────────────────────────────────────────────

try {
    mkdirSync(config.logDir, { recursive: true })
} catch {
    // ignore
}

// ─── 格式化 ───────────────────────────────────────────────────────────────────

function formatMessage(level: Level, message: string, meta?: unknown): string {
    const ts = new Date().toISOString()
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
    return `[${ts}] [${level.toUpperCase()}] ${message}${metaStr}`
}

// ─── 写文件（按日期分割） ─────────────────────────────────────────────────────

function writeToFile(level: Level, line: string): void {
    const date = new Date().toISOString().slice(0, 10)
    const filename = join(config.logDir, `${date}.log`)
    try {
        appendFileSync(filename, line + '\n', 'utf8')
        if (level === 'error') {
            appendFileSync(join(config.logDir, 'error.log'), line + '\n', 'utf8')
        }
    } catch {
        // 若写文件失败不影响主进程
    }
}

// ─── Logger 对象 ──────────────────────────────────────────────────────────────

function log(level: Level, message: string, meta?: unknown): void {
    if (LEVELS[level] < LEVELS[config.logLevel]) return

    const line = formatMessage(level, message, meta)

    // 控制台（带颜色）
    const colored = `${COLORS[level]}${line}${RESET}`
    if (level === 'error') {
        console.error(colored)
    } else {
        console.log(colored)
    }

    // 生产环境写文件
    if (!config.isDev) {
        writeToFile(level, line)
    }
}

export const logger = {
    debug: (msg: string, meta?: unknown) => log('debug', msg, meta),
    info: (msg: string, meta?: unknown) => log('info', msg, meta),
    warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
    error: (msg: string, meta?: unknown) => log('error', msg, meta),
}

export type Logger = typeof logger
