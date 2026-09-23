import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { DataService } from '../../../../core/services/data.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { SpotCardComponent } from '../../../../shared/components/spot-card/spot-card.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    SpotCardComponent,
    SpinnerComponent,
    BottomNavComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchFocused = signal(false);
  maxPriceValue = 10;
  maxPrice = signal(10);
  availableOnly = signal(false);
  results = signal<ParkingSpot[]>([]);
  loading = signal(false);
  totalSpots = signal(0);
  activeChip = signal<string>('all');
  sortBy = signal<string>('relevance');
  viewMode = signal<'list' | 'grid'>('list');
  searchDebounce: any;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.totalSpots.set(this.dataService.getActiveSpots().length);
    this.search();
  }

  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => this.search(), 300);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search();
  }

  setChip(chip: string): void {
    this.activeChip.set(chip);
    this.applyChipFilter();
    this.search();
  }

  applyChipFilter(): void {
    const chip = this.activeChip();
    switch (chip) {
      case 'available':
        this.availableOnly.set(true);
        this.maxPriceValue = 20;
        break;
      case '247':
        this.availableOnly.set(false);
        this.maxPriceValue = 20;
        break;
      case 'ev':
        this.availableOnly.set(false);
        this.maxPriceValue = 20;
        break;
      case 'cheap':
        this.availableOnly.set(false);
        this.maxPriceValue = 3;
        break;
      case 'top':
        this.availableOnly.set(false);
        this.maxPriceValue = 20;
        break;
      default:
        this.availableOnly.set(false);
        this.maxPriceValue = 20;
    }
    this.maxPrice.set(this.maxPriceValue);
  }

  onPriceChange(val: number): void {
    this.maxPriceValue = val;
    this.maxPrice.set(val);
    this.search();
  }

  toggleAvailable(): void {
    this.availableOnly.set(!this.availableOnly());
    this.search();
  }

  setSort(sort: string): void {
    this.sortBy.set(sort);
    this.search();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.maxPriceValue = 20;
    this.maxPrice.set(20);
    this.availableOnly.set(false);
    this.activeChip.set('all');
    this.sortBy.set('relevance');
    this.search();
  }

  search(): void {
    this.loading.set(true);
    setTimeout(() => {
      let spots = this.dataService.searchSpots(this.searchQuery, {
        maxPrice: this.maxPrice(),
        availableOnly: this.availableOnly(),
      });

      // apply chip-specific extra filters
      const chip = this.activeChip();
      if (chip === '247') {
        spots = spots.filter(s => s.operatingHours === '24/7');
      }
      if (chip === 'ev') {
        spots = spots.filter(s => s.description?.toLowerCase().includes('ev'));
      }
      if (chip === 'top') {
        spots = spots.filter(s => s.rating >= 4.5);
      }

      // sort
      switch (this.sortBy()) {
        case 'price':
          spots.sort((a, b) => a.pricePerHour - b.pricePerHour);
          break;
        case 'rating':
          spots.sort((a, b) => b.rating - a.rating);
          break;
        case 'slots':
          spots.sort((a, b) => b.availableSlots - a.availableSlots);
          break;
      }

      this.results.set(spots);
      this.loading.set(false);
    }, 350);
  }

  onSpotClick(spot: ParkingSpot): void {
    this.router.navigate(['/user/parking', spot.id]);
  }

  goBack(): void {
    // search is a tab page, no back navigation needed
  }
}
