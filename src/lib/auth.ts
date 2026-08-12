import type { User, UserRole } from '../types';

export function setToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem('eh_token', token);
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('eh_token');
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('eh_token');
    localStorage.removeItem('eh_user');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function setCurrentUser(user: User): void {
  if (typeof window !== 'undefined') localStorage.setItem('eh_user', JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('eh_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function getDecodedTokenPayload(): { userId: string; role: UserRole } | null {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return { userId: payload.userId, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

export function logout(): void {
  removeToken();
  if (typeof window !== 'undefined') window.location.href = '/login';
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
