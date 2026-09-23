import { User } from './user';

export interface InterestGroup {
  _id: string; // The interest name (e.g. 'chess', 'reading')
  interest: string;
  count: number;
  users: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    interests: string[];
  }>;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  author?: User; // Populated via $lookup in aggregation pipeline
}

export interface UserWithPosts {
  _id: string;
  name: string;
  email: string;
  interests: string[];
  posts: Post[];
  postCount: number;
}
