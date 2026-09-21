import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SpinnerComponent],
  template: `
    <div class="role-page">
      @if (loading()) {
        <app-spinner [fullscreen]="true" message="Setting up your account..." />
      }

      <div class="content">
        <mat-icon class="main-icon">how_to_reg</mat-icon>
        <h1>How will you use E-Parking?</h1>
        <p>Choose your role to get started</p>

        <div class="role-options">
          <button class="role-card" (click)="selectRole('user')" [disabled]="loading()">
            <mat-icon>search</mat-icon>
            <div class="role-info">
              <h3>Find Parking</h3>
              <p>Search and book parking spots near you</p>
            </div>
            <mat-icon class="arrow">chevron_right</mat-icon>
          </button>

          <button class="role-card" (click)="selectRole('owner')" [disabled]="loading()">
            <mat-icon>local_parking</mat-icon>
            <div class="role-info">
              <h3>List My Parking</h3>
              <p>Manage your parking spots and earn money</p>
            </div>
            <mat-icon class="arrow">chevron_right</mat-icon>
          </button>
        </div>

        <p class="hint">You can switch roles later from your profile</p>
      </div>
    </div>
  `,
  styles: [`
    .role-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .content {
      text-align: center;
      max-width: 400px;
      width: 100%;
    }
    .main-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #FF9933;
      margin-bottom: 16px;
    }
    h1 { margin: 0 0 8px; font-size: 24px; }
    .content > p { color: #6b7280; margin: 0 0 32px; }
    .role-options { display: flex; flex-direction: column; gap: 12px; }
    .role-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      background: #ffffff;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }
    .role-card:hover {
      border-color: #FF9933;
      background: #fff7ed;
    }
    .role-card mat-icon:first-child {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #FF9933;
    }
    .role-info { flex: 1; }
    .role-info h3 { margin: 0 0 4px; font-size: 16px; }
    .role-info p { margin: 0; font-size: 13px; color: #6b7280; }
    .arrow { color: #6b7280; }
    .hint {
      margin-top: 24px;
      font-size: 13px;
      color: #9ca3af;
    }
  `],
})
export class RoleSelectComponent {
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  async selectRole(role: 'user' | 'owner'): Promise<void> {
    this.loading.set(true);
    await this.authService.selectRole(role);
    this.loading.set(false);

    if (role === 'user') {
      this.router.navigate(['/user/home']);
    } else {
      this.router.navigate(['/owner/dashboard']);
    }
  }
}
