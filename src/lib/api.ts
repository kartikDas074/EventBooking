import type { ApiResponse, PaginationMeta, Category, Event, User, Booking } from '../types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type { ApiResponse, PaginationMeta, Category, Event, User, Booking };
export type PaginatedResponse<T> = ApiResponse<T> & { meta?: PaginationMeta };

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, { cache: 'no-store', ...options });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.message || `Request failed (${res.status})`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.code = body?.error?.code;
    throw err;
  }

  return res.json();
}
