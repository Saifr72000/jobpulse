import { apiFetch } from './client.ts';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Login failed');
  }
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await apiFetch('/auth/logout', { method: 'POST' });
  if (!res.ok) throw new Error('Logout failed');
}
