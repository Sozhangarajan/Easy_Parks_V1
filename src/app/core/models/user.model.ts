export type UserRole = 'user' | 'owner';

export interface User {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
}
