export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOTES: '/notes',
  ADMIN_USERS: '/admin/users',
  AGGREGATIONS: '/aggregations',
} as const;

export type AppPath = typeof PATHS[keyof typeof PATHS];
