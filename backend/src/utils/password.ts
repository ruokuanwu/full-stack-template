/**
 * 密码哈希工具（基于 Bun 内置的 Argon2id）
 */

/**
 * 对明文密码进行哈希
 */
export async function hashPassword(plain: string): Promise<string> {
    return Bun.password.hash(plain, {
        algorithm: 'argon2id',
        memoryCost: 65536, // 64 MB
        timeCost: 2,
    })
}

/**
 * 验证明文密码与哈希是否匹配
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return Bun.password.verify(plain, hash)
}
