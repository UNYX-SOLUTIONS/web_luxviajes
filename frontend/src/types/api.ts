/**
 * Type definitions for common API responses
 */

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: 'success' | 'error';
    timestamp: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ErrorResponse {
    message: string;
    code: string;
    details?: Record<string, unknown>;
}
