import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../core/services/auth.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    NavbarComponent,
    BottomNavComponent,
  ],
  template: `
    <app-navbar title="Profile" [showMenu]="true" />

    <div class="page-content">
      <div class="profile-header">
        <div class="avatar owner">
          <mat-icon>business</mat-icon>
        </div>
        <h2>{{ user()?.name }}</h2>
        <p>{{ user()?.email }}</p>
        <span class="role-badge">Owner</span>
      </div>

      <div class="profile-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="editName" />
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput [value]="user()?.email" disabled />
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mobile</mat-label>
          <input matInput [value]="user()?.mobile" disabled />
          <mat-icon matPrefix>phone</mat-icon>
        </mat-form-field>

        <button mat-flat-button class="full-width save-btn" (click)="saveProfile()">
          Save Changes
        </button>
      </div>

      <mat-divider />

      <div class="actions">
        <button mat-stroked-button class="full-width switch-btn" (click)="switchRole()">
          <mat-icon>swap_horiz</mat-icon>
          Switch to User
        </button>
        <button mat-stroked-button class="full-width logout-btn" color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>
    </div>

    <app-bottom-nav />
  `,
  styles: [`
    .page-content { padding: 64px 16px 80px; }
    .full-width { width: 100%; }
    .profile-header {
      text-align: center;
      padding: 24px 0;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }
    .avatar.owner {
      background: #fff7ed;
    }
    .avatar mat-icon { font-size: 40px; width: 40px; height: 40px; color: #FF9933; }
    .profile-header h2 { margin: 0; }
    .profile-header p { margin: 4px 0 8px; color: #6b7280; font-size: 14px; }
    .role-badge {
      display: inline-block;
      padding: 2px 12px;
      background: #fff7ed;
      color: #FF9933;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .profile-form { padding: 0 0 16px; }
    .save-btn {
      height: 44px;
      border-radius: 12px;
      margin-top: 8px;
      background: #FF9933;
      color: white;
    }
    mat-divider { margin: 16px 0; }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .switch-btn {
      height: 44px;
      border-radius: 12px;
    }
    .logout-btn {
      height: 44px;
      border-radius: 12px;
    }
  `],
})
export class OwnerProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  user = this.authService.user;
  editName = '';

  constructor() {
    const u = this.authService.user();
    if (u) this.editName = u.name;
  }

  saveProfile(): void {
    alert('Profile saved (mock)');
  }

  async switchRole(): Promise<void> {
    await this.authService.switchRole();
    this.router.navigate(['/auth/role-select']);
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        confirmText: 'Logout',
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) this.authService.logout();
    });
  }
}
