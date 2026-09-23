import { apiClient } from './api';
import { User, CreateUserInput, UpdateUserInput } from '../types/user';
import { ApiResponse, PaginatedResult, PaginationParams } from '../types/api';

export const userService = {
  async getUsers(params?: PaginationParams): Promise<PaginatedResult<User>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<User>>>('/users', {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    });
    return res.data;
  },

  async getUserById(id: string): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>('/users', input);
    return res.data;
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, input);
    return res.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
  },
};
