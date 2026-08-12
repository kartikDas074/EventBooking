import { fetchApi, ApiResponse, PaginatedResponse } from './api';
import { getAuthHeaders } from './auth';
import type { Booking } from '../types';

export type { Booking };

export async function createBooking(eventId: string, quantity: number): Promise<ApiResponse<Booking>> {
  return fetchApi<ApiResponse<Booking>>('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ eventId, quantity }),
  });
}

export async function getMyBookings(): Promise<Booking[]> {
  try {
    const res = await fetchApi<ApiResponse<Booking[]>>('/api/bookings/my', { headers: getAuthHeaders() });
    return res.data;
  } catch {
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const res = await fetchApi<ApiResponse<Booking>>(`/api/bookings/${id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch {
    return null;
  }
}

export async function cancelBooking(id: string): Promise<ApiResponse<Booking>> {
  return fetchApi<ApiResponse<Booking>>(`/api/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
}

export async function getEventBookings(eventId: string): Promise<Booking[]> {
  try {
    const res = await fetchApi<ApiResponse<Booking[]>>(`/api/events/${eventId}/bookings`, { headers: getAuthHeaders() });
    return res.data;
  } catch {
    return [];
  }
}

export async function getAllBookings(page = 1, limit = 20): Promise<PaginatedResponse<Booking[]>> {
  try {
    return await fetchApi<PaginatedResponse<Booking[]>>(`/api/bookings?page=${page}&limit=${limit}`, { headers: getAuthHeaders() });
  } catch {
    return { success: false, message: 'Failed', data: [] };
  }
}

export async function updateBookingStatus(id: string, status: string): Promise<ApiResponse<Booking>> {
  return fetchApi<ApiResponse<Booking>>(`/api/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  });
}
