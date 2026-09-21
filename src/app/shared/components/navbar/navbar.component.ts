import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <mat-toolbar class="navbar">
      @if (showBack()) {
        <button mat-icon-button (click)="onBackClick()">
          <mat-icon>arrow_back</mat-icon>
        </button>
      }
      <span class="title">{{ title() }}</span>
      <span class="spacer"></span>
      @if (showMenu()) {
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onProfileClick()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="onLogoutClick()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      }
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #FF9933;
      color: #ffffff;
    }
    .title { flex: 1; font-weight: 500; }
    .spacer { flex: 1; }
  `],
})
export class NavbarComponent {
  title = input('E-Parking');
  showBack = input(false);
  showMenu = input(false);

  constructor(private router: Router, private authService: AuthService) {}

  onBackClick(): void {
    window.history.back();
  }

  onProfileClick(): void {
    const role = this.authService.userRole();
    this.router.navigate([`/${role}/profile`]);
  }

  onLogoutClick(): void {
    this.authService.logout();
  }
}
