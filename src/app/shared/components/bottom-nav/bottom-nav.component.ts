import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav" [class.owner-nav]="role === 'owner'">
      @if (role === 'user') {
        <a routerLink="/user/home" routerLinkActive="active" class="nav-item">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </a>
        <a routerLink="/user/search" routerLinkActive="active" class="nav-item">
          <mat-icon>search</mat-icon>
          <span>Search</span>
        </a>
        <a routerLink="/user/my-bookings" routerLinkActive="active" class="nav-item">
          <mat-icon>book_online</mat-icon>
          <span>Bookings</span>
        </a>
        <a routerLink="/user/profile" routerLinkActive="active" class="nav-item">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </a>
      } @else {
        <a routerLink="/owner/dashboard" routerLinkActive="active" class="nav-item">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/owner/listings" routerLinkActive="active" class="nav-item">
          <mat-icon>local_parking</mat-icon>
          <span>Listings</span>
        </a>
        <a routerLink="/owner/bookings-requests" routerLinkActive="active" class="nav-item">
          <mat-icon>receipt_long</mat-icon>
          <span>Bookings</span>
        </a>
        <a routerLink="/owner/profile" routerLinkActive="active" class="nav-item">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding: 4px 0 env(safe-area-inset-bottom, 8px);
      z-index: 1000;
      height: 60px;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #6b7280;
      font-size: 11px;
      padding: 4px 12px;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .nav-item.active {
      color: #FF9933;
    }
    .nav-item mat-icon { font-size: 24px; width: 24px; height: 24px; }
  `],
})
export class BottomNavComponent {
  role: 'user' | 'owner' = 'user';

  constructor(private authService: AuthService) {
    this.role = (this.authService.userRole() as 'user' | 'owner') || 'user';
  }
}
