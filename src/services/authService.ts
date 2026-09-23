import { apiClient } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';
import { User } from '../types/user';
import { ApiResponse } from '../types/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data;
  },

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return res.data;
  },
};
