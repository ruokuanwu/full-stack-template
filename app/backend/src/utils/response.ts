import type { ApiResponse, PaginatedResponse } from '@/types'

/**
 * 标准成功响应
 */
export function success<T>(data: T, message = 'OK'): ApiResponse<T> {
    return { success: true, message, data }
}

/**
 * 标准失败响应
 */
export function fail(message: string): ApiResponse<never> {
    return { success: false, message }
}

/**
 * 分页响应
 */
export function paginated<T>(
    items: T[],
    total: number,
    page: number,
    pageSize: number,
): PaginatedResponse<T> {
    return {
        success: true,
        message: 'OK',
        data: items,
        total,
        page,
        pageSize,
    }
}
