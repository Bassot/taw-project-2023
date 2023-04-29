export interface User {
  username?: string;
  email?: string;
  role?: 'Admin' | 'Moderator' | 'User';
}
