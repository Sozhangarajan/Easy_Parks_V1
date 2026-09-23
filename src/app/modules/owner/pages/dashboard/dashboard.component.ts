import { Component, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Booking } from '../../../../core/models/booking.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpinnerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
  recentBookings = signal<Booking[]>([]);
  totalSlots = signal(0);
  occupiedSlots = signal(0);
  private authService = inject(AuthService);
  user = this.authService.user;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  ringDash(): string {
    const circumference = 2 * Math.PI * 40;
    const filled = (this.stats().occupancyRate / 100) * circumference;
    return `${filled} ${circumference}`;
  }

  loadStats(): void {
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        const s = this.dataService.getOwnerStats(user.uid);
        this.stats.set(s);

        const spots = this.dataService.getSpotsByOwner(user.uid);
        const ts = spots.reduce((a, sp) => a + sp.totalSlots, 0);
        const os = spots.reduce((a, sp) => a + (sp.totalSlots - sp.availableSlots), 0);
        this.totalSlots.set(ts);
        this.occupiedSlots.set(os);

        const bookings = this.dataService.getBookingsByOwner(user.uid);
        this.recentBookings.set(bookings.slice(0, 5));

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

  goToProfile(): void {
    this.router.navigate(['/owner/profile']);
  }
}
