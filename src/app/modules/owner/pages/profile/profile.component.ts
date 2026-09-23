import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class OwnerProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private dataService = inject(DataService);

  user = this.authService.user;
  editMode = signal(false);
  editName = '';
  totalSpots = signal(0);
  totalEarnings = signal(0);
  totalBookings = signal(0);
  occupancyRate = signal(0);
  memberSince = signal('');

  ngOnInit(): void {
    const u = this.authService.user();
    if (u) {
      this.editName = u.name;
      this.loadStats(u.uid);
    }
  }

  loadStats(uid: string): void {
    const stats = this.dataService.getOwnerStats(uid);
    this.totalSpots.set(stats.totalSpots);
    this.totalEarnings.set(stats.totalEarnings);
    this.totalBookings.set(stats.totalBookings);
    this.occupancyRate.set(stats.occupancyRate);
    const d = new Date();
    this.memberSince.set(d.toLocaleString('en', { month: 'short', year: 'numeric' }));
  }

  saveProfile(): void {
    this.editMode.set(false);
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
