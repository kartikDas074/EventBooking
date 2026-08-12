import { fetchApi, ApiResponse, PaginatedResponse } from './api';
import { getAuthHeaders } from './auth';
import type { User, UserRole, UserStatus } from '../types';

export async function getAllUsers(page = 1, limit = 20, search = ''): Promise<PaginatedResponse<User[]>> {
  try {
    const q = new URLSearchParams({ page: String(page), limit: String(limit), search });
    return await fetchApi<PaginatedResponse<User[]>>(`/api/users?${q.toString()}`, { headers: getAuthHeaders() });
  } catch {
    return { success: false, message: 'Failed to fetch users', data: [] };
  }
}

export async function updateUserAdmin(
  id: string,
  data: { role?: UserRole; status?: UserStatus; name?: string }
): Promise<ApiResponse<User>> {
  return fetchApi<ApiResponse<User>>(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  return fetchApi<ApiResponse<null>>(`/api/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}
