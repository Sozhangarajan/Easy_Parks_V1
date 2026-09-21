import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    NavbarComponent,
    BottomNavComponent,
    EmptyStateComponent,
    SpinnerComponent,
  ],
  template: `
    <app-navbar title="My Listings" [showMenu]="true" />

    <div class="page-content">
      <div class="actions-bar">
        <button mat-flat-button class="add-btn" (click)="addSpot()">
          <mat-icon>add</mat-icon> Add Spot
        </button>
      </div>

      @if (loading()) {
        <app-spinner message="Loading listings..." />
      } @else if (spots().length === 0) {
        <app-empty-state
          icon="local_parking"
          title="No listings yet"
          message="Add your first parking spot to start earning"
        />
      } @else {
        @for (spot of spots(); track spot.id) {
          <mat-card class="listing-card">
            <div class="listing-content">
              <img [src]="spot.photos[0] || 'https://via.placeholder.com/80'" [alt]="spot.name" class="listing-img" />
              <div class="listing-info">
                <h4>{{ spot.name }}</h4>
                <p class="address">{{ spot.address }}</p>
                <div class="listing-meta">
                  <span class="price">\${{ spot.pricePerHour }}/hr</span>
                  <span class="slots">{{ spot.availableSlots }}/{{ spot.totalSlots }} slots</span>
                </div>
              </div>
            </div>
            <div class="listing-actions">
              <mat-slide-toggle
                [checked]="spot.isActive"
                (change)="toggleActive(spot)"
                color="primary"
              >
                {{ spot.isActive ? 'Active' : 'Inactive' }}
              </mat-slide-toggle>
              <div class="action-buttons">
                <button mat-icon-button (click)="editSpot(spot)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteSpot(spot)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </mat-card>
        }
      }
    </div>

    <app-bottom-nav />
  `,
  styles: [`
    .page-content { padding: 64px 16px 80px; }
    .actions-bar { margin-bottom: 16px; }
    .add-btn {
      border-radius: 12px;
      height: 44px;
    }
    .listing-card {
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .listing-content {
      display: flex;
      gap: 12px;
      padding: 12px;
    }
    .listing-img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }
    .listing-info { flex: 1; }
    .listing-info h4 { margin: 0 0 4px; }
    .address {
      margin: 0 0 8px;
      font-size: 12px;
      color: #6b7280;
    }
    .listing-meta {
      display: flex;
      gap: 12px;
      font-size: 13px;
    }
    .price { font-weight: 600; color: #FF9933; }
    .slots { color: #6b7280; }
    .listing-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-top: 1px solid #e5e7eb;
    }
    .action-buttons { display: flex; gap: 4px; }
  `],
})
export class ListingsComponent implements OnInit {
  spots = signal<ParkingSpot[]>([]);
  loading = signal(true);

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSpots();
  }

  loadSpots(): void {
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        this.spots.set(this.dataService.getSpotsByOwner(user.uid));
        this.loading.set(false);
      }, 500);
    }
  }

  addSpot(): void {
    this.router.navigate(['/owner/add-spot']);
  }

  editSpot(spot: ParkingSpot): void {
    this.router.navigate(['/owner/edit-spot', spot.id]);
  }

  toggleActive(spot: ParkingSpot): void {
    this.dataService.updateSpot(spot.id, { isActive: !spot.isActive });
    this.loadSpots();
  }

  deleteSpot(spot: ParkingSpot): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Spot',
        message: `Are you sure you want to delete "${spot.name}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.deleteSpot(spot.id);
        this.loadSpots();
      }
    });
  }
}
