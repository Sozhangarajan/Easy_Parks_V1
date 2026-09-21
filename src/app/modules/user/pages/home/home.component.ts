import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpotCardComponent } from '../../../../shared/components/spot-card/spot-card.component';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    NavbarComponent,
    BottomNavComponent,
    SpotCardComponent,
    MapComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  template: `
    <app-navbar title="E-Parking" [showMenu]="true" />

    <div class="page-content">
      <div class="search-bar" (click)="goToSearch()">
        <mat-icon>search</mat-icon>
        <span>Search parking spots...</span>
      </div>

      <div class="view-toggle">
        <mat-button-toggle-group [value]="viewMode()" (change)="viewMode.set($event.value)">
          <mat-button-toggle value="map">
            <mat-icon>map</mat-icon> Map
          </mat-button-toggle>
          <mat-button-toggle value="list">
            <mat-icon>list</mat-icon> List
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (viewMode() === 'map') {
        <app-map [spots]="spots()" [height]="350" (markerClicked)="onSpotClick($event)" />
      }

      <div class="spot-list">
        <h3>Nearby Parking Spots</h3>
        @if (loading()) {
          <app-spinner message="Loading spots..." />
        } @else if (spots().length === 0) {
          <app-empty-state
            icon="local_parking"
            title="No spots found"
            message="No parking spots available nearby"
          />
        } @else {
          @for (spot of spots(); track spot.id) {
            <app-spot-card [spot]="spot" (clicked)="onSpotClick($event)" />
          }
        }
      </div>
    </div>

    <app-bottom-nav />
  `,
  styles: [`
    .page-content {
      padding: 64px 16px 80px;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f3f4f6;
      border-radius: 12px;
      cursor: pointer;
      margin-bottom: 16px;
      color: #6b7280;
      font-size: 14px;
    }
    .view-toggle { margin-bottom: 16px; }
    .view-toggle mat-button-toggle-group { width: 100%; }
    .view-toggle mat-button-toggle { flex: 1; }
    .spot-list h3 {
      margin: 16px 0 12px;
      font-size: 18px;
    }
  `],
})
export class HomeComponent implements OnInit {
  spots = signal<ParkingSpot[]>([]);
  loading = signal(true);
  viewMode = signal<'map' | 'list'>('list');

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSpots();
  }

  loadSpots(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.spots.set(this.dataService.getActiveSpots());
      this.loading.set(false);
    }, 500);
  }

  onSpotClick(spot: ParkingSpot): void {
    this.router.navigate(['/user/parking', spot.id]);
  }

  goToSearch(): void {
    this.router.navigate(['/user/search']);
  }
}
