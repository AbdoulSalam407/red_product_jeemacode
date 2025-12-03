import api from './api';
import { LoginInput, SignupInput, ResetPasswordInput } from '../schemas/auth';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const authService = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const response = await api.post('/auth/login/', credentials);
    const data = response.data;
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async signup(credentials: SignupInput): Promise<AuthResponse> {
    const response = await api.post('/auth/register/', {
      email: credentials.email,
      password: credentials.password,
      password2: credentials.confirmPassword,
      first_name: credentials.firstName,
      last_name: credentials.lastName,
    });
    const data = response.data;
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async resetPassword(data: ResetPasswordInput): Promise<void> {
    await api.post('/auth/forgot-password/', data);
  },

  async refreshToken(): Promise<string> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');
    const response = await api.post('/auth/refresh/', { refresh });
    const access = response.data.access;
    localStorage.setItem('access_token', access);
    return access;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
