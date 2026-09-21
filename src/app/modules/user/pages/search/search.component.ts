import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { DataService } from '../../../../core/services/data.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { SpotCardComponent } from '../../../../shared/components/spot-card/spot-card.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    NavbarComponent,
    SpotCardComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  template: `
    <app-navbar title="Search Parking" [showBack]="true" />

    <div class="page-content">
      <div class="search-input">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchQuery" placeholder="Search by name or address" (keyup.enter)="search()" />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="filters">
        <div class="filter-row">
          <label>Max Price: \${{ maxPrice() }}/hr</label>
          <mat-slider [min]="1" [max]="20" [step]="1">
            <input matSliderThumb [(ngModel)]="maxPriceValue" (change)="onFilterChange()" />
          </mat-slider>
        </div>
        <div class="filter-row">
          <mat-checkbox [(ngModel)]="availableOnly" (change)="onFilterChange()">
            Show available only
          </mat-checkbox>
        </div>
      </div>

      <div class="results">
        <h3>{{ results().length }} results found</h3>
        @if (loading()) {
          <app-spinner message="Searching..." />
        } @else if (results().length === 0) {
          <app-empty-state
            icon="search_off"
            title="No results"
            message="Try adjusting your search or filters"
          />
        } @else {
          @for (spot of results(); track spot.id) {
            <app-spot-card [spot]="spot" (clicked)="onSpotClick($event)" />
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 64px 16px 24px; }
    .full-width { width: 100%; }
    .filters {
      padding: 12px 16px;
      background: #f3f4f6;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .filter-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 8px;
    }
    .filter-row label { font-size: 14px; font-weight: 500; }
    .results h3 { margin: 0 0 12px; font-size: 16px; color: #6b7280; }
  `],
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  maxPriceValue = 10;
  maxPrice = signal(10);
  availableOnly = false;
  results = signal<ParkingSpot[]>([]);
  loading = signal(false);

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.results.set(
        this.dataService.searchSpots(this.searchQuery, {
          maxPrice: this.maxPrice(),
          availableOnly: this.availableOnly,
        })
      );
      this.loading.set(false);
    }, 400);
  }

  onFilterChange(): void {
    this.maxPrice.set(this.maxPriceValue);
    this.search();
  }

  onSpotClick(spot: ParkingSpot): void {
    this.router.navigate(['/user/parking', spot.id]);
  }
}
