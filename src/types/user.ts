export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  interests?: string[];
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  interests?: string[];
}
