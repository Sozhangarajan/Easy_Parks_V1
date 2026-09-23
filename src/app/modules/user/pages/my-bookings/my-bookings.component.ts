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
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
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
