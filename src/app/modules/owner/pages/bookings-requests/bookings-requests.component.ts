import { Component, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Booking } from '../../../../core/models/booking.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-bookings-requests',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    NavbarComponent,
    BottomNavComponent,
    EmptyStateComponent,
    SpinnerComponent,
  ],
  template: `
    <app-navbar title="Bookings" [showMenu]="true" />

    <div class="page-content">
      @if (loading()) {
        <app-spinner message="Loading bookings..." />
      } @else {
        <mat-tab-group animationDuration="200ms" class="booking-tabs">
          <mat-tab label="Pending">
            @if (pendingBookings().length === 0) {
              <app-empty-state icon="pending_actions" title="No pending requests" message="New booking requests will appear here" />
            } @else {
              @for (booking of pendingBookings(); track booking.id) {
                <div class="booking-card">
                  <div class="booking-header">
                    <div>
                      <h4>{{ booking.spotName }}</h4>
                      <p class="user-name">{{ booking.userName }}</p>
                    </div>
                    <span class="status-badge pending">Pending</span>
                  </div>
                  <div class="booking-details">
                    <div class="detail">
                      <mat-icon>calendar_today</mat-icon>
                      <span>{{ booking.startTime | date:'mediumDate' }}</span>
                    </div>
                    <div class="detail">
                      <mat-icon>schedule</mat-icon>
                      <span>{{ booking.startTime | date:'shortTime' }} - {{ booking.endTime | date:'shortTime' }}</span>
                    </div>
                    <div class="detail">
                      <mat-icon>payments</mat-icon>
                      <span>\${{ booking.totalCost }}</span>
                    </div>
                  </div>
                  <div class="booking-actions">
                    <button mat-flat-button color="primary" (click)="updateStatus(booking, 'confirmed')">
                      Confirm
                    </button>
                    <button mat-stroked-button color="warn" (click)="updateStatus(booking, 'cancelled')">
                      Reject
                    </button>
                  </div>
                </div>
              }
            }
          </mat-tab>

          <mat-tab label="Active">
            @if (activeBookings().length === 0) {
              <app-empty-state icon="event_available" title="No active bookings" message="Active bookings will appear here" />
            } @else {
              @for (booking of activeBookings(); track booking.id) {
                <div class="booking-card">
                  <div class="booking-header">
                    <div>
                      <h4>{{ booking.spotName }}</h4>
                      <p class="user-name">{{ booking.userName }}</p>
                    </div>
                    <span class="status-badge confirmed">Confirmed</span>
                  </div>
                  <div class="booking-details">
                    <div class="detail">
                      <mat-icon>schedule</mat-icon>
                      <span>{{ booking.startTime | date:'shortTime' }} - {{ booking.endTime | date:'shortTime' }}</span>
                    </div>
                    <div class="detail">
                      <mat-icon>payments</mat-icon>
                      <span>\${{ booking.totalCost }}</span>
                    </div>
                  </div>
                </div>
              }
            }
          </mat-tab>

          <mat-tab label="Past">
            @if (pastBookings().length === 0) {
              <app-empty-state icon="history" title="No past bookings" message="Completed bookings will appear here" />
            } @else {
              @for (booking of pastBookings(); track booking.id) {
                <div class="booking-card past">
                  <div class="booking-header">
                    <h4>{{ booking.spotName }}</h4>
                    <span class="status-badge" [class]="booking.status">{{ booking.status }}</span>
                  </div>
                  <div class="booking-details">
                    <div class="detail">
                      <mat-icon>person</mat-icon>
                      <span>{{ booking.userName }}</span>
                    </div>
                    <div class="detail">
                      <mat-icon>payments</mat-icon>
                      <span>\${{ booking.totalCost }}</span>
                    </div>
                  </div>
                </div>
              }
            }
          </mat-tab>
        </mat-tab-group>
      }
    </div>

    <app-bottom-nav />
  `,
  styles: [`
    .page-content { padding: 64px 16px 80px; }
    .booking-tabs { margin-top: 8px; }
    .booking-card {
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 12px;
    }
    .booking-card.past { opacity: 0.7; }
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .booking-header h4 { margin: 0; }
    .user-name { margin: 4px 0 0; font-size: 13px; color: #6b7280; }
    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }
    .status-badge.pending { background: #fff7ed; color: #FF9933; }
    .status-badge.confirmed { background: #dcfce7; color: #138808; }
    .status-badge.completed { background: #f3f4f6; color: #374151; }
    .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
    .booking-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .detail {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6b7280;
    }
    .detail mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .booking-actions { display: flex; gap: 8px; }
    .booking-actions button { flex: 1; border-radius: 8px; }
  `],
})
export class BookingsRequestsComponent implements OnInit {
  pendingBookings = signal<Booking[]>([]);
  activeBookings = signal<Booking[]>([]);
  pastBookings = signal<Booking[]>([]);
  loading = signal(true);

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        const all = this.dataService.getBookingsByOwner(user.uid);
        this.pendingBookings.set(all.filter((b) => b.status === 'pending'));
        this.activeBookings.set(all.filter((b) => b.status === 'confirmed' || b.status === 'active'));
        this.pastBookings.set(all.filter((b) => b.status === 'completed' || b.status === 'cancelled'));
        this.loading.set(false);
      }, 500);
    }
  }

  updateStatus(booking: Booking, status: 'confirmed' | 'cancelled'): void {
    this.dataService.updateBookingStatus(booking.id, status);
    this.loadBookings();
  }
}
