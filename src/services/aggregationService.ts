import { apiClient } from './api';
import { InterestGroup, UserWithPosts, Post } from '../types/aggregation';
import { ApiResponse } from '../types/api';

export const aggregationService = {
  // Scenario 1: Specific view to see users grouped by interests
  async getGroupedByInterests(): Promise<InterestGroup[]> {
    const res = await apiClient.get<ApiResponse<InterestGroup[]>>('/aggregations/grouped-by-interests');
    return res.data;
  },

  // Scenario 2: Retrieve all posts belonging to a particular user via single aggregation pipeline with $lookup
  async getUserPosts(userId: string): Promise<UserWithPosts> {
    const res = await apiClient.get<ApiResponse<UserWithPosts>>(`/aggregations/user-posts/${userId}`);
    return res.data;
  },

  // Helper: Create post for testing Scenario 2
  async createPost(input: { title: string; content: string }): Promise<Post> {
    const res = await apiClient.post<ApiResponse<Post>>('/posts', input);
    return res.data;
  },
};
