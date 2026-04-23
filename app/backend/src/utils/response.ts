const DEFAULT_MESSAGE = 'OK'

export function success<T>(data: T, message = DEFAULT_MESSAGE) {
    return { success: true as const, message, data }
}

export function fail(message: string) {
    return { success: false as const, message }
}

export function paginated<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    message = DEFAULT_MESSAGE,
) {
    return { success: true as const, message, data, total, page, pageSize }
}
