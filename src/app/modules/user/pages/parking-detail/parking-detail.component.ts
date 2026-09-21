import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { Review } from '../../../../core/models/review.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    NavbarComponent,
    MapComponent,
    RatingComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  template: `
    <app-navbar [title]="spot()?.name || 'Parking Detail'" [showBack]="true" />

    <div class="page-content">
      @if (loading()) {
        <app-spinner message="Loading details..." />
      } @else if (spot()) {
        <div class="spot-image">
          <img [src]="spot()!.photos[0] || 'https://via.placeholder.com/400x200'" [alt]="spot()!.name" />
          @if (spot()!.availableSlots === 0) {
            <div class="full-badge">Fully Booked</div>
          }
        </div>

        <div class="spot-info">
          <div class="info-header">
            <h2>{{ spot()!.name }}</h2>
            <div class="rating-row">
              <app-rating [value]="spot()!.rating" [showValue]="true" />
              <span class="review-count">({{ spot()!.reviewCount }} reviews)</span>
            </div>
          </div>

          <div class="detail-row">
            <mat-icon>location_on</mat-icon>
            <span>{{ spot()!.address }}</span>
          </div>

          <div class="detail-row">
            <mat-icon>schedule</mat-icon>
            <span>{{ spot()!.operatingHours || '24/7' }}</span>
          </div>

          <div class="detail-row">
            <mat-icon>payments</mat-icon>
            <span class="price">\${{ spot()!.pricePerHour }}/hour</span>
          </div>

          <div class="slots-info">
            <div class="slot-stat">
              <span class="slot-number available">{{ spot()!.availableSlots }}</span>
              <span class="slot-label">Available</span>
            </div>
            <div class="slot-stat">
              <span class="slot-number total">{{ spot()!.totalSlots }}</span>
              <span class="slot-label">Total</span>
            </div>
            <div class="slot-stat">
              <span class="slot-number occupied">{{ spot()!.totalSlots - spot()!.availableSlots }}</span>
              <span class="slot-label">Occupied</span>
            </div>
          </div>

          @if (spot()!.description) {
            <p class="description">{{ spot()!.description }}</p>
          }

          <app-map [singleSpot]="spot()" [height]="200" />

          <h3>Reviews</h3>
          @if (reviews().length === 0) {
            <app-empty-state icon="rate_review" title="No reviews" message="Be the first to review" />
          } @else {
            @for (review of reviews(); track review.id) {
              <div class="review-card">
                <div class="review-header">
                  <span class="reviewer-name">{{ review.userName }}</span>
                  <app-rating [value]="review.rating" />
                </div>
                <p class="review-comment">{{ review.comment }}</p>
              </div>
            }
          }
        </div>

        <div class="book-bar">
          <div class="price-display">
            <span class="amount">\${{ spot()!.pricePerHour }}</span>
            <span class="per">/hour</span>
          </div>
          <button
            mat-flat-button
            class="book-btn"
            (click)="bookNow()"
            [disabled]="spot()!.availableSlots === 0"
          >
            {{ spot()!.availableSlots === 0 ? 'Fully Booked' : 'Book Now' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-content { padding: 56px 0 80px; }
    .spot-image {
      position: relative;
      height: 220px;
      overflow: hidden;
    }
    .spot-image img { width: 100%; height: 100%; object-fit: cover; }
    .full-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #dc2626;
      color: white;
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
    }
    .spot-info { padding: 16px; }
    .info-header { margin-bottom: 16px; }
    h2 { margin: 0 0 8px; }
    .rating-row { display: flex; align-items: center; gap: 8px; }
    .review-count { font-size: 13px; color: #6b7280; }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .detail-row mat-icon { color: #FF9933; font-size: 20px; width: 20px; height: 20px; }
    .price { font-weight: 600; color: #FF9933; font-size: 16px; }
    .slots-info {
      display: flex;
      justify-content: space-around;
      padding: 16px;
      margin: 16px 0;
      background: #f3f4f6;
      border-radius: 12px;
    }
    .slot-stat { text-align: center; }
    .slot-number { display: block; font-size: 24px; font-weight: 600; }
    .slot-number.available { color: #138808; }
    .slot-number.total { color: #1a1a1a; }
    .slot-number.occupied { color: #FF9933; }
    .slot-label { font-size: 12px; color: #6b7280; }
    .description { font-size: 14px; line-height: 1.5; color: #6b7280; margin: 16px 0; }
    h3 { margin: 24px 0 12px; }
    .review-card {
      padding: 12px;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .reviewer-name { font-weight: 500; font-size: 14px; }
    .review-comment { margin: 0; font-size: 13px; color: #6b7280; }
    .book-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
    }
    .price-display { display: flex; align-items: baseline; gap: 2px; }
    .amount { font-size: 24px; font-weight: 700; color: #FF9933; }
    .per { font-size: 14px; color: #6b7280; }
    .book-btn {
      height: 44px;
      padding: 0 32px;
      border-radius: 12px;
      font-size: 16px;
      background: #FF9933;
      color: white;
    }
  `],
})
export class ParkingDetailComponent implements OnInit {
  spot = signal<ParkingSpot | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);

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
        this.spot.set(this.dataService.getSpotById(id) ?? null);
        this.reviews.set(this.dataService.getReviewsBySpot(id));
        this.loading.set(false);
      }, 500);
    }
  }

  bookNow(): void {
    if (this.spot()) {
      this.router.navigate(['/user/booking-confirm', this.spot()!.id]);
    }
  }
}
