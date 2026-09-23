import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpinnerComponent,
  ],
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
})
export class ListingsComponent implements OnInit {
  spots = signal<ParkingSpot[]>([]);
  filteredSpots = signal<ParkingSpot[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('all');
  activeCount = signal(0);
  inactiveCount = signal(0);

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
        const all = this.dataService.getSpotsByOwner(user.uid);
        this.spots.set(all);
        this.activeCount.set(all.filter(s => s.isActive).length);
        this.inactiveCount.set(all.filter(s => !s.isActive).length);
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
    const all = this.spots();
    if (f === 'active') {
      this.filteredSpots.set(all.filter(s => s.isActive));
    } else if (f === 'inactive') {
      this.filteredSpots.set(all.filter(s => !s.isActive));
    } else {
      this.filteredSpots.set(all);
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
