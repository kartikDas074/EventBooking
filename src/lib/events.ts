import { fetchApi, PaginatedResponse, ApiResponse } from './api';
import type { Event } from '../types';

export interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  status?: string;
  sort?: string;
  organizerId?: string;
}

export async function getEvents(params: EventQueryParams = {}): Promise<PaginatedResponse<Event[]>> {
  const q = new URLSearchParams();
  if (params.page) q.append('page', String(params.page));
  if (params.limit) q.append('limit', String(params.limit));
  if (params.search) q.append('search', params.search);
  if (params.category) q.append('category', params.category);
  if (params.location) q.append('location', params.location);
  if (params.status) q.append('status', params.status);
  if (params.sort) q.append('sort', params.sort);
  if (params.organizerId) q.append('organizerId', params.organizerId);
  const qs = q.toString();
  try {
    return await fetchApi<PaginatedResponse<Event[]>>(`/api/events${qs ? `?${qs}` : ''}`);
  } catch {
    return { success: false, message: 'Failed to fetch events', data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const res = await fetchApi<ApiResponse<Event>>(`/api/events/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function createEvent(data: Partial<Event>, token: string): Promise<ApiResponse<Event>> {
  return fetchApi<ApiResponse<Event>>('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id: string, data: Partial<Event>, token: string): Promise<ApiResponse<Event>> {
  return fetchApi<ApiResponse<Event>>(`/api/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string, token: string): Promise<ApiResponse<null>> {
  return fetchApi<ApiResponse<null>>(`/api/events/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
