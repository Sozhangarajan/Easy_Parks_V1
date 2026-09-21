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
  template: `
    <div class="search-page">

      <!-- ===== HERO HEADER ===== -->
      <div class="hero-header">
        <div class="hero-bg"></div>

        <div class="hero-content">
          <h1>Find Parking</h1>
          <p class="hero-sub">Search {{ totalSpots() }} spots near you</p>

          <!-- SEARCH INPUT -->
          <div class="search-box">
            <div class="search-input-wrap" [class.focused]="searchFocused()">
              <mat-icon class="search-icon">search</mat-icon>
              <input
                type="text"
                placeholder="Search by name or address..."
                [(ngModel)]="searchQuery"
                (focus)="searchFocused.set(true)"
                (blur)="searchFocused.set(false)"
                (input)="onSearchInput()"
              />
              @if (searchQuery) {
                <button class="clear-btn" (click)="clearSearch()">
                  <mat-icon>close</mat-icon>
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="main-content">

        <!-- QUICK FILTER CHIPS -->
        <div class="chips-section">
          <div class="chips-scroll">
            <button class="chip" [class.active]="activeChip() === 'all'" (click)="setChip('all')">
              <mat-icon>grid_view</mat-icon>
              All
            </button>
            <button class="chip" [class.active]="activeChip() === 'available'" (click)="setChip('available')">
              <mat-icon>check_circle</mat-icon>
              Available
            </button>
            <button class="chip" [class.active]="activeChip() === '247'" (click)="setChip('247')">
              <mat-icon>schedule</mat-icon>
              24/7
            </button>
            <button class="chip" [class.active]="activeChip() === 'ev'" (click)="setChip('ev')">
              <mat-icon>ev_station</mat-icon>
              EV Charging
            </button>
            <button class="chip" [class.active]="activeChip() === 'cheap'" (click)="setChip('cheap')">
              <mat-icon>savings</mat-icon>
              Under $3/hr
            </button>
            <button class="chip" [class.active]="activeChip() === 'top'" (click)="setChip('top')">
              <mat-icon>star</mat-icon>
              Top Rated
            </button>
          </div>
        </div>

        <!-- FILTERS SECTION -->
        <div class="filters-card">
          <div class="filter-header">
            <div class="filter-title">
              <mat-icon>tune</mat-icon>
              <span>Filters</span>
            </div>
            <button class="reset-btn" (click)="resetFilters()">Reset</button>
          </div>

          <!-- PRICE RANGE -->
          <div class="filter-group">
            <div class="filter-label">
              <span>Max Price</span>
              <span class="price-badge">\${{ maxPrice() }}/hr</span>
            </div>
            <mat-slider [min]="1" [max]="20" [step]="1" class="price-slider">
              <input matSliderThumb [ngModel]="maxPriceValue" (ngModelChange)="onPriceChange($event)" />
            </mat-slider>
            <div class="price-labels">
              <span>$1</span>
              <span>$20</span>
            </div>
          </div>

          <!-- AVAILABILITY TOGGLE -->
          <div class="filter-group">
            <div class="toggle-row" (click)="toggleAvailable()">
              <div class="toggle-info">
                <mat-icon [class.active]="availableOnly()">check_circle</mat-icon>
                <span>Available only</span>
              </div>
              <div class="toggle-track" [class.on]="availableOnly()">
                <div class="toggle-thumb"></div>
              </div>
            </div>
          </div>

          <!-- SORT BY -->
          <div class="filter-group">
            <div class="filter-label"><span>Sort by</span></div>
            <div class="sort-options">
              <button class="sort-btn" [class.active]="sortBy() === 'relevance'" (click)="setSort('relevance')">
                <mat-icon>trending_up</mat-icon>
                Relevance
              </button>
              <button class="sort-btn" [class.active]="sortBy() === 'price'" (click)="setSort('price')">
                <mat-icon>payments</mat-icon>
                Price
              </button>
              <button class="sort-btn" [class.active]="sortBy() === 'rating'" (click)="setSort('rating')">
                <mat-icon>star</mat-icon>
                Rating
              </button>
              <button class="sort-btn" [class.active]="sortBy() === 'slots'" (click)="setSort('slots')">
                <mat-icon>local_parking</mat-icon>
                Slots
              </button>
            </div>
          </div>
        </div>

        <!-- RESULTS HEADER -->
        <div class="results-header">
          <div class="results-info">
            <span class="results-count">{{ results().length }}</span>
            <span class="results-label">spots found</span>
          </div>
          <div class="view-toggle">
            <button class="view-btn" [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">
              <mat-icon>view_list</mat-icon>
            </button>
            <button class="view-btn" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">
              <mat-icon>grid_view</mat-icon>
            </button>
          </div>
        </div>

        <!-- RESULTS -->
        @if (loading()) {
          <app-spinner message="Searching..." />
        } @else if (results().length === 0) {
          <div class="empty-wrap">
            <div class="empty-illustration">
              <mat-icon>search_off</mat-icon>
            </div>
            <h3>No spots found</h3>
            <p>Try adjusting your search or filters</p>
            <button class="retry-btn" (click)="resetFilters()">
              <mat-icon>refresh</mat-icon>
              Reset Filters
            </button>
          </div>
        } @else {
          <div [class]="viewMode() === 'grid' ? 'spot-grid' : 'spot-list'">
            @for (spot of results(); track spot.id) {
              <app-spot-card [spot]="spot" (clicked)="onSpotClick($event)" />
            }
          </div>
        }
      </div>

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .search-page {
      min-height: 100vh;
      background: #f0f5f7;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- HERO HEADER ---------- */
    .hero-header {
      position: relative;
      overflow: hidden;
      padding-bottom: 28px;
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

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1.5px solid rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 16px;
    }
    .back-btn:hover {
      background: rgba(255,255,255,0.2);
      border-color: rgba(255,255,255,0.4);
    }
    .back-btn mat-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .hero-header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      color: white;
    }
    .hero-sub {
      margin: 4px 0 20px;
      font-size: 13px;
      color: rgba(255,255,255,0.65);
    }

    /* ---------- SEARCH BOX ---------- */
    .search-box {
      margin-top: -6px;
    }
    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      border-radius: 16px;
      padding: 12px 14px;
      box-shadow: 0 8px 24px rgba(11,47,74,0.2);
      transition: box-shadow 0.25s, transform 0.2s;
      border: 2px solid transparent;
    }
    .search-input-wrap.focused {
      border-color: #f2c94c;
      box-shadow: 0 8px 28px rgba(242,201,76,0.25);
      transform: translateY(-1px);
    }
    .search-icon {
      color: #0f7173;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    .search-input-wrap input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      font-family: 'Poppins', 'Roboto', sans-serif;
      color: #0b2f4a;
      background: transparent;
    }
    .search-input-wrap input::placeholder {
      color: #b0bec5;
    }
    .clear-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: #f0f5f7;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .clear-btn:hover { background: #dfe7eb; }
    .clear-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #5b7385;
    }

    /* ---------- MAIN CONTENT ---------- */
    .main-content {
      padding: 0 18px 90px;
    }

    /* ---------- CHIPS ---------- */
    .chips-section {
      margin-bottom: 16px;
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
      gap: 6px;
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
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .chip:hover {
      border-color: #0f7173;
      color: #0f7173;
    }
    .chip.active {
      background: #0f7173;
      border-color: #0f7173;
      color: white;
    }

    /* ---------- FILTERS CARD ---------- */
    .filters-card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 18px;
      box-shadow: 0 2px 12px rgba(11,47,74,0.06);
    }
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .filter-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .filter-title mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #0f7173;
    }
    .reset-btn {
      font-size: 12.5px;
      font-weight: 600;
      color: #FF9933;
      background: none;
      border: none;
      cursor: pointer;
    }

    .filter-group {
      margin-bottom: 16px;
    }
    .filter-group:last-child { margin-bottom: 0; }

    .filter-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #5b7385;
    }
    .price-badge {
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      color: white;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }

    .price-slider {
      width: 100%;
    }
    .price-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #9aa8b1;
    }

    /* toggle */
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 10px 0;
    }
    .toggle-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #0b2f4a;
    }
    .toggle-info mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #dfe7eb;
      transition: color 0.2s;
    }
    .toggle-info mat-icon.active { color: #0f7173; }
    .toggle-track {
      width: 44px;
      height: 24px;
      border-radius: 12px;
      background: #dfe7eb;
      position: relative;
      transition: background 0.25s;
    }
    .toggle-track.on { background: #0f7173; }
    .toggle-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      position: absolute;
      top: 2px;
      left: 2px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      transition: transform 0.25s;
    }
    .toggle-track.on .toggle-thumb { transform: translateX(20px); }

    /* sort */
    .sort-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .sort-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 4px;
      border-radius: 12px;
      border: 1.5px solid #e3e9ec;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .sort-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9aa8b1;
    }
    .sort-btn span,
    .sort-btn {
      font-size: 11px;
      font-weight: 600;
      color: #9aa8b1;
    }
    .sort-btn:hover {
      border-color: #0f7173;
    }
    .sort-btn.active {
      border-color: #0f7173;
      background: #eef6f8;
    }
    .sort-btn.active mat-icon { color: #0f7173; }
    .sort-btn.active { color: #0f7173; }

    /* ---------- RESULTS HEADER ---------- */
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .results-info {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .results-count {
      font-size: 22px;
      font-weight: 800;
      color: #0b2f4a;
    }
    .results-label {
      font-size: 13px;
      color: #9aa8b1;
    }
    .view-toggle {
      display: flex;
      gap: 4px;
      background: #e3e9ec;
      border-radius: 10px;
      padding: 3px;
    }
    .view-btn {
      width: 32px;
      height: 28px;
      border-radius: 8px;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .view-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9aa8b1;
    }
    .view-btn.active {
      background: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .view-btn.active mat-icon { color: #0f7173; }

    /* ---------- SPOT LIST / GRID ---------- */
    .spot-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .spot-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

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
    .retry-btn {
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
    .retry-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(15,113,115,0.3);
    }
    .retry-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `],
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
