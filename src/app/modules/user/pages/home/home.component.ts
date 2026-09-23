import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpotCardComponent } from '../../../../shared/components/spot-card/spot-card.component';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpotCardComponent,
    MapComponent,
    SpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  spots = signal<ParkingSpot[]>([]);
  displaySpots = signal<ParkingSpot[]>([]);
  loading = signal(true);
  viewMode = signal<'list' | 'map'>('list');
  showAll = signal(false);
  activeQuickFilter = signal<string | null>(null);

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSpots();
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  loadSpots(): void {
    this.loading.set(true);
    setTimeout(() => {
      const all = this.dataService.getActiveSpots();
      this.spots.set(all);
      this.displaySpots.set(all);
      this.loading.set(false);
    }, 500);
  }

  setQuickFilter(filter: string): void {
    if (this.activeQuickFilter() === filter) {
      this.clearQuickFilter();
      return;
    }
    this.activeQuickFilter.set(filter);
    this.showAll.set(false);
    this.applyQuickFilter(filter);
  }

  clearQuickFilter(): void {
    this.activeQuickFilter.set(null);
    this.showAll.set(false);
    this.displaySpots.set(this.spots());
  }

  applyQuickFilter(filter: string): void {
    let filtered = [...this.spots()];
    switch (filter) {
      case 'ev':
        filtered = filtered.filter(s => s.description?.toLowerCase().includes('ev'));
        break;
      case '247':
        filtered = filtered.filter(s => s.operatingHours === '24/7');
        break;
      case 'cheap':
        filtered = filtered.filter(s => s.pricePerHour <= 3);
        break;
      case 'nearby':
        filtered = filtered.filter(s => s.availableSlots > 0);
        break;
    }
    this.displaySpots.set(filtered);
  }

  getSectionTitle(): string {
    const titles: Record<string, string> = {
      nearby: 'Nearby Spots',
      ev: 'EV Charging Spots',
      '247': '24/7 Open Spots',
      cheap: 'Budget-Friendly Spots',
    };
    return this.activeQuickFilter() ? (titles[this.activeQuickFilter()!] || 'Filtered Spots') : 'Parking Spots';
  }

  getFilterSpotTitle(): string {
    const titles: Record<string, string> = {
      nearby: 'Available Nearby',
      ev: 'EV Charging Stations',
      '247': 'Open 24/7',
      cheap: 'Under $3/hr',
    };
    return titles[this.activeQuickFilter()!] || 'Filtered Spots';
  }

  getEmptyIcon(): string {
    const icons: Record<string, string> = {
      nearby: 'near_me',
      ev: 'ev_station',
      '247': 'schedule',
      cheap: 'local_offer',
    };
    return icons[this.activeQuickFilter()!] || 'local_parking';
  }

  getEmptyTitle(): string {
    const titles: Record<string, string> = {
      nearby: 'No nearby spots',
      ev: 'No EV charging spots',
      '247': 'No 24/7 spots',
      cheap: 'No cheap spots',
    };
    return titles[this.activeQuickFilter()!] || 'No spots found';
  }

  getEmptyMessage(): string {
    const msgs: Record<string, string> = {
      nearby: 'No available spots found nearby',
      ev: 'No EV charging stations available right now',
      '247': 'No 24/7 parking spots found',
      cheap: 'No spots under $3/hr available',
    };
    return msgs[this.activeQuickFilter()!] || 'No parking spots available';
  }

  onSpotClick(spot: ParkingSpot): void {
    this.router.navigate(['/user/parking', spot.id]);
  }

  goToSearch(): void {
    this.router.navigate(['/user/search']);
  }

  goToProfile(): void {
    this.router.navigate(['/user/profile']);
  }
}
