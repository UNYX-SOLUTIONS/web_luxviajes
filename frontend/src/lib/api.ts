import { logger } from "./logger";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Enhanced fetch wrapper with error handling
 */
export async function fetchAPI<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    // logger.error(`Fetch failed: ${url}`, error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function get<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchAPI<T>(url, {
    ...options,
    method: "GET",
  });
}

/**
 * POST request helper
 */
export async function post<T>(
  url: string,
  body?: unknown,
  options?: FetchOptions,
): Promise<T> {
  return fetchAPI<T>(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });
}
