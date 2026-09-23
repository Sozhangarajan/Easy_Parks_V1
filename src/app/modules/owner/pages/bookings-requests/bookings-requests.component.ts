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
  templateUrl: './bookings-requests.component.html',
  styleUrls: ['./bookings-requests.component.css'],
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
