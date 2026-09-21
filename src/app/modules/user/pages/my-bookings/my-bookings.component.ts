import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpinnerComponent,
  ],
  template: `
    <div class="bookings-page">

      <!-- ===== HERO HEADER ===== -->
      <div class="hero-header">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>My Bookings</h1>
          <p class="hero-sub">Manage your parking reservations</p>

          <!-- STATS ROW -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon si-active">
                <mat-icon>event</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">{{ activeCount() }}</span>
                <span class="stat-label">Active</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon si-pending">
                <mat-icon>hourglass_top</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">{{ pendingCount() }}</span>
                <span class="stat-label">Pending</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon si-spent">
                <mat-icon>payments</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">\${{ totalSpent() }}</span>
                <span class="stat-label">Spent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="main-content">

        <!-- FILTER CHIPS -->
        <div class="filter-chips">
          <div class="chips-scroll">
            <button class="chip" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">
              All
              <span class="chip-count">{{ allBookings().length }}</span>
            </button>
            <button class="chip" [class.active]="activeFilter() === 'pending'" (click)="setFilter('pending')">
              <mat-icon>hourglass_top</mat-icon>
              Pending
            </button>
            <button class="chip" [class.active]="activeFilter() === 'confirmed'" (click)="setFilter('confirmed')">
              <mat-icon>check_circle</mat-icon>
              Confirmed
            </button>
            <button class="chip" [class.active]="activeFilter() === 'active'" (click)="setFilter('active')">
              <mat-icon>directions_car</mat-icon>
              Active
            </button>
            <button class="chip" [class.active]="activeFilter() === 'completed'" (click)="setFilter('completed')">
              <mat-icon>task_alt</mat-icon>
              Completed
            </button>
            <button class="chip" [class.active]="activeFilter() === 'cancelled'" (click)="setFilter('cancelled')">
              <mat-icon>cancel</mat-icon>
              Cancelled
            </button>
          </div>
        </div>

        <!-- BOOKING LIST -->
        @if (loading()) {
          <app-spinner message="Loading bookings..." />
        } @else if (filteredBookings().length === 0) {
          <div class="empty-wrap">
            <div class="empty-illustration">
              <mat-icon>{{ getEmptyIcon() }}</mat-icon>
            </div>
            <h3>{{ getEmptyTitle() }}</h3>
            <p>{{ getEmptyMessage() }}</p>
            <button class="explore-btn" (click)="goToSearch()">
              <mat-icon>search</mat-icon>
              Find Parking
            </button>
          </div>
        } @else {
          <div class="booking-list">
            @for (booking of filteredBookings(); track booking.id) {
              <div class="booking-card" [class.cancelled]="booking.status === 'cancelled'" [class.completed]="booking.status === 'completed'">

                <!-- card top bar -->
                <div class="card-top">
                  <span class="status-badge" [class]="'badge-' + booking.status">
                    <mat-icon>{{ getStatusIcon(booking.status) }}</mat-icon>
                    {{ booking.status }}
                  </span>
                  <span class="booking-id">#{{ booking.id }}</span>
                </div>

                <!-- spot name -->
                <div class="spot-row">
                  <div class="spot-icon">
                    <mat-icon>local_parking</mat-icon>
                  </div>
                  <div class="spot-info">
                    <h3>{{ booking.spotName }}</h3>
                    <p class="owner">by {{ booking.ownerName }}</p>
                  </div>
                </div>

                <!-- details grid -->
                <div class="details-grid">
                  <div class="detail-item">
                    <mat-icon>calendar_today</mat-icon>
                    <div>
                      <span class="detail-label">Date</span>
                      <span class="detail-value">{{ booking.startTime | date:'MMM d, yyyy' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <div>
                      <span class="detail-label">Time</span>
                      <span class="detail-value">{{ booking.startTime | date:'shortTime' }} - {{ booking.endTime | date:'shortTime' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <mat-icon>timer</mat-icon>
                    <div>
                      <span class="detail-label">Duration</span>
                      <span class="detail-value">{{ booking.totalHours }}h</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <mat-icon>payments</mat-icon>
                    <div>
                      <span class="detail-label">Cost</span>
                      <span class="detail-value cost">\${{ booking.totalCost }}</span>
                    </div>
                  </div>
                </div>

                <!-- actions -->
                @if (booking.status !== 'cancelled' && booking.status !== 'completed') {
                  <div class="card-actions">
                    <button class="action-btn btn-view" (click)="viewSpot(booking)">
                      <mat-icon>visibility</mat-icon>
                      View Spot
                    </button>
                    <button class="action-btn btn-cancel" (click)="cancelBooking(booking)">
                      <mat-icon>close</mat-icon>
                      Cancel
                    </button>
                  </div>
                }
                @if (booking.status === 'completed') {
                  <div class="card-actions">
                    <button class="action-btn btn-review" (click)="viewSpot(booking)">
                      <mat-icon>star</mat-icon>
                      Review
                    </button>
                    <button class="action-btn btn-rebook" (click)="viewSpot(booking)">
                      <mat-icon>replay</mat-icon>
                      Rebook
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .bookings-page {
      min-height: 100vh;
      background: #f0f5f7;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- HERO HEADER ---------- */
    .hero-header {
      position: relative;
      overflow: hidden;
      padding-bottom: 24px;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(160deg, #0b2f4a 0%, #12587a 40%, #2f9bbf 100%);
    }
    .hero-content {
      position: relative;
      z-index: 2;
      padding: 20px 18px 0;
    }
    .hero-header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      color: white;
    }
    .hero-sub {
      margin: 4px 0 18px;
      font-size: 13px;
      color: rgba(255,255,255,0.65);
    }

    /* ---------- STATS ROW ---------- */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 10px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 14px;
      backdrop-filter: blur(8px);
    }
    .stat-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: white;
    }
    .si-active { background: rgba(255,255,255,0.2); }
    .si-pending { background: rgba(255,255,255,0.2); }
    .si-spent { background: rgba(255,255,255,0.2); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-num {
      font-size: 18px;
      font-weight: 800;
      color: white;
    }
    .stat-label {
      font-size: 11px;
      color: rgba(255,255,255,0.6);
    }

    /* ---------- MAIN CONTENT ---------- */
    .main-content {
      padding: 0 18px 90px;
    }

    /* ---------- FILTER CHIPS ---------- */
    .filter-chips {
      margin-bottom: 18px;
    }
    .chips-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0;
      scrollbar-width: none;
    }
    .chips-scroll::-webkit-scrollbar { display: none; }

    .chip {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1.5px solid #dfe7eb;
      background: white;
      font-size: 12.5px;
      font-weight: 600;
      color: #5b7385;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .chip mat-icon {
      font-size: 15px;
      width: 15px;
      height: 15px;
    }
    .chip-count {
      background: #0f7173;
      color: white;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 999px;
      font-weight: 700;
    }
    .chip:hover { border-color: #0f7173; color: #0f7173; }
    .chip.active {
      background: #0f7173;
      border-color: #0f7173;
      color: white;
    }
    .chip.active .chip-count {
      background: rgba(255,255,255,0.3);
    }

    /* ---------- BOOKING LIST ---------- */
    .booking-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .booking-card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 2px 12px rgba(11,47,74,0.06);
      transition: transform 0.15s;
    }
    .booking-card:hover { transform: translateY(-1px); }
    .booking-card.cancelled { opacity: 0.6; }
    .booking-card.completed { opacity: 0.85; }

    /* card top */
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: capitalize;
    }
    .status-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .badge-pending { background: #fff7ed; color: #FF9933; }
    .badge-confirmed { background: #dcfce7; color: #138808; }
    .badge-active { background: #e0f2fe; color: #0284c7; }
    .badge-completed { background: #f3f4f6; color: #6b7280; }
    .badge-cancelled { background: #fee2e2; color: #dc2626; }

    .booking-id {
      font-size: 12px;
      font-weight: 600;
      color: #b0bec5;
    }

    /* spot row */
    .spot-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .spot-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .spot-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: white;
    }
    .spot-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .spot-info .owner {
      margin: 2px 0 0;
      font-size: 12.5px;
      color: #9aa8b1;
    }

    /* details grid */
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      background: #f7f9fb;
      border-radius: 10px;
    }
    .detail-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #0f7173;
    }
    .detail-item div {
      display: flex;
      flex-direction: column;
    }
    .detail-label {
      font-size: 10px;
      color: #9aa8b1;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .detail-value {
      font-size: 13px;
      font-weight: 600;
      color: #0b2f4a;
    }
    .detail-value.cost {
      color: #FF9933;
    }

    /* actions */
    .card-actions {
      display: flex;
      gap: 10px;
      padding-top: 12px;
      border-top: 1px solid #f0f5f7;
    }
    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border-radius: 12px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .action-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .btn-view {
      background: #eef6f8;
      color: #0f7173;
    }
    .btn-view:hover { background: #d5eef2; }
    .btn-cancel {
      background: #fef2f2;
      color: #dc2626;
    }
    .btn-cancel:hover { background: #fde8e8; }
    .btn-review {
      background: #fff7ed;
      color: #FF9933;
    }
    .btn-review:hover { background: #ffedd5; }
    .btn-rebook {
      background: #eef6f8;
      color: #0f7173;
    }
    .btn-rebook:hover { background: #d5eef2; }

    /* ---------- EMPTY STATE ---------- */
    .empty-wrap {
      text-align: center;
      padding: 40px 20px;
    }
    .empty-illustration {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef6f8, #dfe7eb);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .empty-illustration mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #9aa8b1;
    }
    .empty-wrap h3 {
      margin: 0 0 6px;
      font-size: 17px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .empty-wrap p {
      margin: 0 0 20px;
      font-size: 13px;
      color: #9aa8b1;
    }
    .explore-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .explore-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(15,113,115,0.3);
    }
    .explore-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `],
})
export class MyBookingsComponent implements OnInit {
  allBookings = signal<Booking[]>([]);
  filteredBookings = signal<Booking[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('all');
  activeCount = signal(0);
  pendingCount = signal(0);
  totalSpent = signal(0);

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        const all = this.dataService.getBookingsByUser(user.uid);
        this.allBookings.set(all);
        this.activeCount.set(all.filter(b => ['confirmed', 'active'].includes(b.status)).length);
        this.pendingCount.set(all.filter(b => b.status === 'pending').length);
        this.totalSpent.set(all.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalCost, 0));
        this.applyFilter();
        this.loading.set(false);
      }, 500);
    }
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.applyFilter();
  }

  applyFilter(): void {
    const filter = this.activeFilter();
    const all = this.allBookings();
    if (filter === 'all') {
      this.filteredBookings.set(all);
    } else {
      this.filteredBookings.set(all.filter(b => b.status === filter));
    }
  }

  getStatusIcon(status: BookingStatus): string {
    const icons: Record<BookingStatus, string> = {
      pending: 'hourglass_top',
      confirmed: 'check_circle',
      active: 'directions_car',
      completed: 'task_alt',
      cancelled: 'cancel',
    };
    return icons[status];
  }

  getEmptyIcon(): string {
    const icons: Record<string, string> = {
      all: 'receipt_long',
      pending: 'hourglass_empty',
      confirmed: 'check_circle_outline',
      active: 'directions_car',
      completed: 'task',
      cancelled: 'block',
    };
    return icons[this.activeFilter()];
  }

  getEmptyTitle(): string {
    const titles: Record<string, string> = {
      all: 'No bookings yet',
      pending: 'No pending bookings',
      confirmed: 'No confirmed bookings',
      active: 'No active bookings',
      completed: 'No completed bookings',
      cancelled: 'No cancelled bookings',
    };
    return titles[this.activeFilter()];
  }

  getEmptyMessage(): string {
    const msgs: Record<string, string> = {
      all: 'Your parking bookings will appear here',
      pending: 'Waiting for owner confirmation',
      confirmed: 'Your confirmed reservations',
      active: 'Currently active parking sessions',
      completed: 'Your past parking history',
      cancelled: 'No cancelled bookings',
    };
    return msgs[this.activeFilter()];
  }

  viewSpot(booking: Booking): void {
    this.router.navigate(['/user/parking', booking.spotId]);
  }

  goToSearch(): void {
    this.router.navigate(['/user/search']);
  }

  cancelBooking(booking: Booking): void {
    this.dataService.cancelBooking(booking.id);
    this.loadBookings();
  }
}
