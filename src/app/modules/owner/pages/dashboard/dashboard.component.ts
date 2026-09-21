import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NavbarComponent,
    BottomNavComponent,
    SpinnerComponent,
  ],
  template: `
    <app-navbar title="Owner Dashboard" [showMenu]="true" />

    <div class="page-content">
      @if (loading()) {
        <app-spinner message="Loading dashboard..." />
      } @else {
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-icon>local_parking</mat-icon>
            <div class="stat-value">{{ stats().totalSpots }}</div>
            <div class="stat-label">Total Spots</div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>check_circle</mat-icon>
            <div class="stat-value">{{ stats().activeSpots }}</div>
            <div class="stat-label">Active</div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>book_online</mat-icon>
            <div class="stat-value">{{ stats().totalBookings }}</div>
            <div class="stat-label">Bookings</div>
          </mat-card>
          <mat-card class="stat-card earnings">
            <mat-icon>payments</mat-icon>
            <div class="stat-value">\${{ stats().totalEarnings }}</div>
            <div class="stat-label">Earnings</div>
          </mat-card>
        </div>

        <div class="occupancy-section">
          <h3>Occupancy Rate</h3>
          <div class="occupancy-bar">
            <div class="occupancy-fill" [style.width.%]="stats().occupancyRate"></div>
          </div>
          <span class="occupancy-text">{{ stats().occupancyRate }}% occupied</span>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <button mat-stroked-button class="action-btn" (click)="addSpot()">
            <mat-icon>add</mat-icon>
            Add New Spot
          </button>
          <button mat-stroked-button class="action-btn" (click)="viewListings()">
            <mat-icon>list</mat-icon>
            View Listings
          </button>
          <button mat-stroked-button class="action-btn" (click)="viewBookings()">
            <mat-icon>receipt_long</mat-icon>
            View Bookings
          </button>
        </div>
      }
    </div>

    <app-bottom-nav />
  `,
  styles: [`
    .page-content { padding: 64px 16px 80px; }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      padding: 16px;
      text-align: center;
      border-radius: 12px;
    }
    .stat-card mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #FF9933;
      margin-bottom: 8px;
    }
    .stat-card.earnings mat-icon { color: #138808; }
    .stat-value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .stat-label { font-size: 12px; color: #6b7280; }
    .occupancy-section {
      margin-bottom: 24px;
    }
    h3 { margin: 0 0 12px; }
    .occupancy-bar {
      height: 8px;
      background: #f3f4f6;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .occupancy-fill {
      height: 100%;
      background: #FF9933;
      border-radius: 4px;
      transition: width 0.5s;
    }
    .occupancy-text {
      font-size: 13px;
      color: #6b7280;
    }
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .action-btn {
      height: 48px;
      border-radius: 12px;
      justify-content: flex-start;
      gap: 12px;
    }
  `],
})
export class OwnerDashboardComponent implements OnInit {
  stats = signal({
    totalSpots: 0,
    activeSpots: 0,
    totalBookings: 0,
    totalEarnings: 0,
    occupancyRate: 0,
  });
  loading = signal(true);

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        this.stats.set(this.dataService.getOwnerStats(user.uid));
        this.loading.set(false);
      }, 500);
    }
  }

  addSpot(): void {
    this.router.navigate(['/owner/add-spot']);
  }

  viewListings(): void {
    this.router.navigate(['/owner/listings']);
  }

  viewBookings(): void {
    this.router.navigate(['/owner/bookings-requests']);
  }
}
