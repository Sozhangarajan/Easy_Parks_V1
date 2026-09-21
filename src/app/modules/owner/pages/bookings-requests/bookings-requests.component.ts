import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-bookings-requests',
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
        <div class="anim-layer">
          <div class="float-shape fs-1"><mat-icon>receipt_long</mat-icon></div>
          <div class="float-shape fs-2"><mat-icon>check_circle</mat-icon></div>
          <div class="float-shape fs-3"><mat-icon>pending</mat-icon></div>
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
        </div>

        <div class="hero-content">
          <h1>Booking Requests</h1>
          <p class="hero-sub">Manage incoming reservations</p>

          <div class="stats-row">
            <div class="stat-pill sp-pending">
              <span class="stat-num">{{ pendingCount() }}</span>
              <span class="stat-label">Pending</span>
            </div>
            <div class="stat-pill sp-active">
              <span class="stat-num">{{ activeCount() }}</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat-pill sp-done">
              <span class="stat-num">{{ completedCount() }}</span>
              <span class="stat-label">Done</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="main-content">

        <!-- FILTER CHIPS -->
        <div class="filter-chips">
          <button class="chip" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">
            All
            <span class="chip-count">{{ totalCount() }}</span>
          </button>
          <button class="chip" [class.active]="activeFilter() === 'pending'" (click)="setFilter('pending')">
            <mat-icon>pending</mat-icon>
            Pending
          </button>
          <button class="chip" [class.active]="activeFilter() === 'confirmed'" (click)="setFilter('confirmed')">
            <mat-icon>check_circle</mat-icon>
            Confirmed
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
          </div>
        } @else {
          <div class="booking-list">
            @for (booking of filteredBookings(); track booking.id) {
              <div class="booking-card" [class.bc-past]="booking.status === 'completed' || booking.status === 'cancelled'">

                <!-- card top -->
                <div class="card-top">
                  <span class="status-badge" [class]="'badge-' + booking.status">
                    <mat-icon>{{ getStatusIcon(booking.status) }}</mat-icon>
                    {{ booking.status }}
                  </span>
                  <span class="booking-id">#{{ booking.id }}</span>
                </div>

                <!-- user + spot -->
                <div class="user-row">
                  <div class="user-avatar">
                    <span>{{ booking.userName.charAt(0) }}</span>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ booking.userName }}</span>
                    <span class="spot-name">
                      <mat-icon>local_parking</mat-icon>
                      {{ booking.spotName }}
                    </span>
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
                      <span class="detail-label">Revenue</span>
                      <span class="detail-value cost">\${{ booking.totalCost }}</span>
                    </div>
                  </div>
                </div>

                <!-- actions -->
                @if (booking.status === 'pending') {
                  <div class="card-actions">
                    <button class="action-btn btn-confirm" (click)="updateStatus(booking, 'confirmed')">
                      <mat-icon>check</mat-icon>
                      Confirm
                    </button>
                    <button class="action-btn btn-reject" (click)="updateStatus(booking, 'cancelled')">
                      <mat-icon>close</mat-icon>
                      Reject
                    </button>
                  </div>
                }
                @if (booking.status === 'completed') {
                  <div class="card-actions">
                    <button class="action-btn btn-view">
                      <mat-icon>visibility</mat-icon>
                      View Details
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

    .anim-layer { position: absolute; inset: 0; overflow: hidden; }
    .float-shape {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(4px);
      animation: drift 16s linear infinite;
    }
    .float-shape mat-icon { font-size: 20px; width: 20px; height: 20px; color: rgba(255,255,255,0.2); }
    .fs-1 { width: 42px; height: 42px; top: 8%; left: 8%; animation-delay: 0s; }
    .fs-2 { width: 36px; height: 36px; top: 50%; right: 10%; border-radius: 50%; animation-delay: -5s; }
    .fs-3 { width: 38px; height: 38px; top: 70%; left: 25%; animation-delay: -8s; }
    @keyframes drift {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0.5; }
      25%  { transform: translateY(-15px) rotate(4deg); opacity: 0.75; }
      50%  { transform: translateY(-6px) rotate(-3deg); opacity: 0.45; }
      75%  { transform: translateY(-20px) rotate(3deg); opacity: 0.7; }
      100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      animation: orbPulse 5s ease-in-out infinite alternate;
    }
    .orb-1 { width: 160px; height: 160px; top: -40px; left: -30px; background: rgba(242,201,76,0.18); }
    .orb-2 { width: 130px; height: 130px; bottom: -30px; right: -20px; background: rgba(47,155,191,0.2); animation-delay: -2.5s; }
    @keyframes orbPulse { 0% { transform: scale(1); opacity: 0.35; } 100% { transform: scale(1.15); opacity: 0.6; } }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 20px 18px 0;
    }
    .hero-content h1 { margin: 0; font-size: 26px; font-weight: 800; color: white; }
    .hero-sub { margin: 4px 0 16px; font-size: 13px; color: rgba(255,255,255,0.65); }

    .stats-row { display: flex; gap: 8px; }
    .stat-pill {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 8px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      backdrop-filter: blur(8px);
    }
    .stat-num { font-size: 20px; font-weight: 800; color: white; }
    .stat-label { font-size: 11px; color: rgba(255,255,255,0.6); }
    .sp-pending { border-color: rgba(242,201,76,0.4); background: rgba(242,201,76,0.12); }
    .sp-active { border-color: rgba(19,136,8,0.4); background: rgba(19,136,8,0.12); }
    .sp-done { border-color: rgba(255,255,255,0.25); }

    /* ---------- MAIN CONTENT ---------- */
    .main-content { padding: 0 18px 90px; }

    /* ---------- FILTER CHIPS ---------- */
    .filter-chips {
      display: flex;
      justify-content: center;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0;
      margin-bottom: 16px;
      scrollbar-width: none;
    }
    .filter-chips::-webkit-scrollbar { display: none; }
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
    .chip mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .chip-count {
      background: #0f7173;
      color: white;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 999px;
      font-weight: 700;
    }
    .chip:hover { border-color: #0f7173; color: #0f7173; }
    .chip.active { background: #0f7173; border-color: #0f7173; color: white; }
    .chip.active .chip-count { background: rgba(255,255,255,0.3); }

    /* ---------- BOOKING LIST ---------- */
    .booking-list { display: flex; flex-direction: column; gap: 14px; }

    .booking-card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 2px 12px rgba(11,47,74,0.06);
      transition: transform 0.15s;
    }
    .booking-card:hover { transform: translateY(-1px); }
    .booking-card.bc-past { opacity: 0.75; }

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
    .status-badge mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .badge-pending { background: #fff7ed; color: #FF9933; }
    .badge-confirmed { background: #dcfce7; color: #138808; }
    .badge-active { background: #e0f2fe; color: #0284c7; }
    .badge-completed { background: #f3f4f6; color: #6b7280; }
    .badge-cancelled { background: #fee2e2; color: #dc2626; }
    .booking-id { font-size: 12px; font-weight: 600; color: #b0bec5; }

    .user-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .user-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF9933, #e67300);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 15px; font-weight: 700; color: #0b2f4a; }
    .spot-name {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12.5px;
      color: #9aa8b1;
    }
    .spot-name mat-icon { font-size: 13px; width: 13px; height: 13px; color: #0f7173; }

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
    .detail-item mat-icon { font-size: 16px; width: 16px; height: 16px; color: #0f7173; }
    .detail-item div { display: flex; flex-direction: column; }
    .detail-label { font-size: 10px; color: #9aa8b1; text-transform: uppercase; letter-spacing: 0.3px; }
    .detail-value { font-size: 13px; font-weight: 600; color: #0b2f4a; }
    .detail-value.cost { color: #FF9933; }

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
      padding: 11px;
      border-radius: 12px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .action-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .btn-confirm {
      background: linear-gradient(135deg, #138808, #22c55e);
      color: white;
    }
    .btn-confirm:hover { box-shadow: 0 4px 12px rgba(19,136,8,0.3); transform: translateY(-1px); }
    .btn-reject {
      background: #fef2f2;
      color: #dc2626;
    }
    .btn-reject:hover { background: #fde8e8; }
    .btn-view {
      background: #eef6f8;
      color: #0f7173;
    }
    .btn-view:hover { background: #d5eef2; }

    /* ---------- EMPTY STATE ---------- */
    .empty-wrap { text-align: center; padding: 40px 20px; }
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
    .empty-illustration mat-icon { font-size: 36px; width: 36px; height: 36px; color: #9aa8b1; }
    .empty-wrap h3 { margin: 0 0 6px; font-size: 17px; font-weight: 700; color: #0b2f4a; }
    .empty-wrap p { margin: 0; font-size: 13px; color: #9aa8b1; }
  `],
})
export class BookingsRequestsComponent implements OnInit {
  allBookings = signal<Booking[]>([]);
  filteredBookings = signal<Booking[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('all');
  pendingCount = signal(0);
  activeCount = signal(0);
  completedCount = signal(0);
  totalCount = signal(0);

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        const all = this.dataService.getBookingsByOwner(user.uid);
        this.allBookings.set(all);
        this.pendingCount.set(all.filter(b => b.status === 'pending').length);
        this.activeCount.set(all.filter(b => ['confirmed', 'active'].includes(b.status)).length);
        this.completedCount.set(all.filter(b => b.status === 'completed').length);
        this.totalCount.set(all.length);
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
    const f = this.activeFilter();
    const all = this.allBookings();
    if (f === 'all') {
      this.filteredBookings.set(all);
    } else {
      this.filteredBookings.set(all.filter(b => b.status === f));
    }
  }

  getStatusIcon(status: BookingStatus): string {
    const icons: Record<BookingStatus, string> = {
      pending: 'pending',
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
      pending: 'pending_actions',
      confirmed: 'check_circle_outline',
      completed: 'task',
      cancelled: 'block',
    };
    return icons[this.activeFilter()];
  }

  getEmptyTitle(): string {
    const titles: Record<string, string> = {
      all: 'No bookings yet',
      pending: 'No pending requests',
      confirmed: 'No confirmed bookings',
      completed: 'No completed bookings',
      cancelled: 'No cancelled bookings',
    };
    return titles[this.activeFilter()];
  }

  getEmptyMessage(): string {
    const msgs: Record<string, string> = {
      all: 'Booking requests will appear here',
      pending: 'Waiting for user confirmations',
      confirmed: 'Active reservations from users',
      completed: 'Past booking history',
      cancelled: 'No cancelled bookings',
    };
    return msgs[this.activeFilter()];
  }

  updateStatus(booking: Booking, status: 'confirmed' | 'cancelled'): void {
    this.dataService.updateBookingStatus(booking.id, status);
    this.loadBookings();
  }
}
