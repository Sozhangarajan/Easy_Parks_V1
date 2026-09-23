import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { Review } from '../../../../core/models/review.model';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MapComponent,
    SpinnerComponent,
  ],
  templateUrl: './parking-detail.component.html',
  styleUrls: ['./parking-detail.component.css'],
})
export class ParkingDetailComponent implements OnInit {
  spot = signal<ParkingSpot | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);
  isFavorite = signal(false);
  occupancyPercent = signal(0);

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      setTimeout(() => {
        const s = this.dataService.getSpotById(id);
        this.spot.set(s ?? null);
        if (s) {
          this.reviews.set(this.dataService.getReviewsBySpot(id));
          this.occupancyPercent.set(
            s.totalSlots > 0 ? Math.round(((s.totalSlots - s.availableSlots) / s.totalSlots) * 100) : 0
          );
        }
        this.loading.set(false);
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/user/home']);
  }

  toggleFavorite(): void {
    this.isFavorite.set(!this.isFavorite());
  }

  bookNow(): void {
    if (this.spot() && this.spot()!.availableSlots > 0) {
      this.router.navigate(['/user/booking-confirm', this.spot()!.id]);
    }
  }
}
