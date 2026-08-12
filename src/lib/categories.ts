import { fetchApi, ApiResponse } from './api';
import type { Category } from '../types';
import { getAuthHeaders } from './auth';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchApi<ApiResponse<Category[]>>('/api/categories');
    return res.data;
  } catch {
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const res = await fetchApi<ApiResponse<Category>>(`/api/categories/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function createCategory(data: { name: string; description?: string }): Promise<ApiResponse<Category>> {
  return fetchApi<ApiResponse<Category>>('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: { name?: string; description?: string }): Promise<ApiResponse<Category>> {
  return fetchApi<ApiResponse<Category>>(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  return fetchApi<ApiResponse<null>>(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}
