import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal(false);

  user = this.currentUser.asReadonly();
  loggedIn = this.isAuthenticated.asReadonly();
  userRole = computed(() => this.currentUser()?.role ?? null);

  private mockUsers: (User & { password: string })[] = [
    {
      uid: '1',
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1234567890',
      password: 'password123',
      role: 'user',
      createdAt: new Date(),
    },
    {
      uid: '2',
      name: 'Jane Owner',
      email: 'jane@example.com',
      mobile: '+0987654321',
      password: 'password123',
      role: 'owner',
      createdAt: new Date(),
    },
  ];

  constructor(private router: Router) {
    const saved = localStorage.getItem('eparking_user');
    if (saved) {
      const user = JSON.parse(saved) as User;
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  async login(emailOrMobile: string, password: string): Promise<{ success: boolean; message: string; needsRoleSelection?: boolean }> {
    await this.simulateDelay();
    const found = this.mockUsers.find(
      (u) => (u.email === emailOrMobile || u.mobile === emailOrMobile) && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid credentials' };
    }
    const { password: _, ...user } = found;
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('eparking_user', JSON.stringify(user));
    return { success: true, message: 'Login successful', needsRoleSelection: false };
  }

  async register(data: { name: string; email: string; mobile: string; password: string }): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    const exists = this.mockUsers.find((u) => u.email === data.email || u.mobile === data.mobile);
    if (exists) {
      return { success: false, message: 'User already exists with this email or mobile' };
    }
    const newUser: User & { password: string } = {
      uid: Date.now().toString(),
      ...data,
      role: 'user' as UserRole,
      createdAt: new Date(),
    };
    this.mockUsers.push(newUser);
    const { password: _, ...user } = newUser;
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('eparking_user', JSON.stringify(user));
    return { success: true, message: 'Registration successful' };
  }

  async selectRole(role: UserRole): Promise<void> {
    await this.simulateDelay();
    const user = this.currentUser();
    if (user) {
      const updated = { ...user, role };
      this.currentUser.set(updated);
      localStorage.setItem('eparking_user', JSON.stringify(updated));
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    const found = this.mockUsers.find((u) => u.email === email);
    if (!found) {
      return { success: false, message: 'No account found with this email' };
    }
    return { success: true, message: 'Password reset link sent to your email' };
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('eparking_user');
    this.router.navigate(['/auth/landing']);
  }

  async switchRole(): Promise<void> {
    const user = this.currentUser();
    if (user) {
      const newRole: UserRole = user.role === 'user' ? 'owner' : 'user';
      await this.selectRole(newRole);
    }
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}
