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
  template: `
    <div class="detail-page">

      @if (loading()) {
        <div class="spinner-wrap">
          <app-spinner [fullscreen]="true" message="Loading details..." />
        </div>
      } @else if (spot()) {

        <!-- ===== HERO IMAGE ===== -->
        <div class="hero-image">
          <img [src]="spot()!.photos[0] || 'https://via.placeholder.com/400x250'" [alt]="spot()!.name" />
          <div class="hero-overlay"></div>

          @if (spot()!.availableSlots === 0) {
            <div class="full-badge">
              <mat-icon>block</mat-icon>
              Fully Booked
            </div>
          }

          <div class="hero-top-bar">
            <button class="hero-btn" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <button class="hero-btn" (click)="toggleFavorite()">
              <mat-icon>{{ isFavorite() ? 'favorite' : 'favorite_border' }}</mat-icon>
            </button>
          </div>

          <!-- floating spot info -->
          <div class="hero-bottom">
            <div class="hero-rating">
              <mat-icon>star</mat-icon>
              <span>{{ spot()!.rating | number:'1.1-1' }}</span>
              <span class="review-count">({{ spot()!.reviewCount }})</span>
            </div>
          </div>
        </div>

        <!-- ===== MAIN CONTENT ===== -->
        <div class="main-content">

          <!-- TITLE + ADDRESS -->
          <div class="title-section">
            <h1>{{ spot()!.name }}</h1>
            <div class="address-row">
              <mat-icon>location_on</mat-icon>
              <span>{{ spot()!.address }}</span>
            </div>
          </div>

          <!-- QUICK INFO CHIPS -->
          <div class="chips-row">
            <div class="info-chip">
              <mat-icon>schedule</mat-icon>
              <span>{{ spot()!.operatingHours || '24/7' }}</span>
            </div>
            <div class="info-chip">
              <mat-icon>payments</mat-icon>
              <span>\${{ spot()!.pricePerHour }}/hr</span>
            </div>
            <div class="info-chip" [class.available]="spot()!.availableSlots > 0" [class.full]="spot()!.availableSlots === 0">
              <mat-icon>local_parking</mat-icon>
              <span>{{ spot()!.availableSlots }} slots</span>
            </div>
          </div>

          <!-- AVAILABILITY CARD -->
          <div class="card">
            <div class="card-header">
              <mat-icon>pie_chart</mat-icon>
              <span>Availability</span>
            </div>
            <div class="slots-grid">
              <div class="slot-item">
                <div class="slot-ring available">
                  <span>{{ spot()!.availableSlots }}</span>
                </div>
                <span class="slot-label">Available</span>
              </div>
              <div class="slot-item">
                <div class="slot-ring occupied">
                  <span>{{ spot()!.totalSlots - spot()!.availableSlots }}</span>
                </div>
                <span class="slot-label">Occupied</span>
              </div>
              <div class="slot-item">
                <div class="slot-ring total">
                  <span>{{ spot()!.totalSlots }}</span>
                </div>
                <span class="slot-label">Total</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="occupancyPercent()"></div>
            </div>
            <span class="progress-label">{{ occupancyPercent() }}% occupied</span>
          </div>

          <!-- DESCRIPTION -->
          @if (spot()!.description) {
            <div class="card">
              <div class="card-header">
                <mat-icon>info</mat-icon>
                <span>About</span>
              </div>
              <p class="description">{{ spot()!.description }}</p>
              <div class="amenity-chips">
                <div class="amenity">
                  <mat-icon>security</mat-icon>
                  <span>Secure</span>
                </div>
                <div class="amenity">
                  <mat-icon>light</mat-icon>
                  <span>Well Lit</span>
                </div>
                <div class="amenity">
                  <mat-icon>cctv</mat-icon>
                  <span>CCTV</span>
                </div>
                @if (spot()!.operatingHours === '24/7') {
                  <div class="amenity">
                    <mat-icon>all_inclusive</mat-icon>
                    <span>24/7</span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- MAP -->
          <div class="card">
            <div class="card-header">
              <mat-icon>map</mat-icon>
              <span>Location</span>
            </div>
            <div class="map-wrap">
              <app-map [singleSpot]="spot()" [height]="200" />
            </div>
          </div>

          <!-- REVIEWS -->
          <div class="card">
            <div class="card-header">
              <mat-icon>reviews</mat-icon>
              <span>Reviews</span>
              @if (reviews().length > 0) {
                <span class="review-badge">{{ reviews().length }}</span>
              }
            </div>

            @if (reviews().length === 0) {
              <div class="empty-reviews">
                <mat-icon>rate_review</mat-icon>
                <p>No reviews yet. Be the first!</p>
              </div>
            } @else {
              <div class="reviews-list">
                @for (review of reviews(); track review.id) {
                  <div class="review-card">
                    <div class="review-top">
                      <div class="reviewer-avatar">
                        <span>{{ review.userName.charAt(0) }}</span>
                      </div>
                      <div class="review-info">
                        <span class="reviewer-name">{{ review.userName }}</span>
                        <span class="review-date">{{ review.createdAt | date:'MMM d, yyyy' }}</span>
                      </div>
                      <div class="review-stars">
                        @for (s of [1,2,3,4,5]; track s) {
                          <mat-icon [class.filled]="s <= review.rating">
                            {{ s <= review.rating ? 'star' : 'star_border' }}
                          </mat-icon>
                        }
                      </div>
                    </div>
                    <p class="review-text">{{ review.comment }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- ===== STICKY BOOK BAR ===== -->
        <div class="book-bar">
          <div class="book-price">
            <span class="price-amount">\${{ spot()!.pricePerHour }}</span>
            <span class="price-unit">/hour</span>
          </div>
          <button class="book-btn" [class.disabled]="spot()!.availableSlots === 0" [disabled]="spot()!.availableSlots === 0" (click)="bookNow()">
            <mat-icon>{{ spot()!.availableSlots === 0 ? 'block' : 'event_available' }}</mat-icon>
            {{ spot()!.availableSlots === 0 ? 'Fully Booked' : 'Book Now' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .detail-page {
      min-height: 100vh;
      background: #f0f5f7;
      font-family: 'Poppins', 'Roboto', sans-serif;
      padding-bottom: 80px;
    }

    /* ---------- HERO IMAGE ---------- */
    .hero-image {
      position: relative;
      height: 280px;
      overflow: hidden;
    }
    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(11,47,74,0.3) 0%, transparent 40%, rgba(11,47,74,0.6) 100%);
    }

    .full-badge {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      background: #dc2626;
      color: white;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      z-index: 3;
    }
    .full-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .hero-top-bar {
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      z-index: 3;
    }
    .hero-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: none;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .hero-btn:hover { background: rgba(255,255,255,0.35); }
    .hero-btn mat-icon { color: white; font-size: 20px; width: 20px; height: 20px; }

    .hero-bottom {
      position: absolute;
      bottom: 16px;
      right: 16px;
      z-index: 3;
    }
    .hero-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 14px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(8px);
      border-radius: 999px;
      color: white;
      font-size: 14px;
      font-weight: 700;
    }
    .hero-rating mat-icon { font-size: 18px; width: 18px; height: 18px; color: #f2c94c; }
    .review-count { font-size: 12px; opacity: 0.7; }

    /* ---------- MAIN CONTENT ---------- */
    .main-content {
      padding: 0 18px;
      margin-top: 10px;
      position: relative;
      z-index: 2;
    }

    /* ---------- TITLE SECTION ---------- */
    .title-section {
      margin-bottom: 16px;
    }
    .title-section h1 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 800;
      color: #0b2f4a;
    }
    .address-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #9aa8b1;
    }
    .address-row mat-icon { font-size: 16px; width: 16px; height: 16px; color: #FF9933; }

    /* ---------- INFO CHIPS ---------- */
    .chips-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .info-chip {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      background: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: #5b7385;
      box-shadow: 0 2px 8px rgba(11,47,74,0.06);
    }
    .info-chip mat-icon { font-size: 16px; width: 16px; height: 16px; color: #0f7173; }
    .info-chip.available { border: 1.5px solid #138808; color: #138808; }
    .info-chip.available mat-icon { color: #138808; }
    .info-chip.full { border: 1.5px solid #dc2626; color: #dc2626; }
    .info-chip.full mat-icon { color: #dc2626; }

    /* ---------- CARDS ---------- */
    .card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 14px;
      box-shadow: 0 2px 12px rgba(11,47,74,0.06);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      font-size: 15px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .card-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #0f7173;
    }

    /* slots grid */
    .slots-grid {
      display: flex;
      justify-content: space-around;
      margin-bottom: 14px;
    }
    .slot-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .slot-ring {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 800;
      border: 3px solid;
    }
    .slot-ring.available {
      color: #138808;
      border-color: #138808;
      background: #f0fdf4;
    }
    .slot-ring.occupied {
      color: #FF9933;
      border-color: #FF9933;
      background: #fff7ed;
    }
    .slot-ring.total {
      color: #0f7173;
      border-color: #0f7173;
      background: #eef6f8;
    }
    .slot-label {
      font-size: 12px;
      color: #9aa8b1;
      font-weight: 600;
    }

    .progress-bar {
      height: 8px;
      background: #eef6f8;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #FF9933, #e67300);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .progress-label {
      font-size: 11px;
      color: #9aa8b1;
    }

    /* description */
    .description {
      margin: 0 0 14px;
      font-size: 13.5px;
      line-height: 1.6;
      color: #5b7385;
    }
    .amenity-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .amenity {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      background: #f0f5f7;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      color: #0f7173;
    }
    .amenity mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* map */
    .map-wrap {
      border-radius: 14px;
      overflow: hidden;
    }

    /* reviews */
    .review-badge {
      margin-left: auto;
      background: #0f7173;
      color: white;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 999px;
    }

    .empty-reviews {
      text-align: center;
      padding: 24px 0;
    }
    .empty-reviews mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #dfe7eb;
    }
    .empty-reviews p {
      margin: 8px 0 0;
      font-size: 13px;
      color: #9aa8b1;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .review-card {
      padding: 14px;
      background: #f7f9fb;
      border-radius: 14px;
    }
    .review-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .reviewer-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .review-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .reviewer-name {
      font-size: 13px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .review-date {
      font-size: 11px;
      color: #9aa8b1;
    }
    .review-stars {
      display: flex;
      gap: 1px;
    }
    .review-stars mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #dfe7eb;
    }
    .review-stars mat-icon.filled { color: #FF9933; }
    .review-text {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      color: #5b7385;
    }

    /* ---------- BOOK BAR ---------- */
    .book-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: white;
      border-top: 1px solid #f0f5f7;
      box-shadow: 0 -4px 16px rgba(11,47,74,0.08);
      z-index: 10;
    }
    .book-price {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }
    .price-amount {
      font-size: 26px;
      font-weight: 800;
      color: #FF9933;
    }
    .price-unit {
      font-size: 14px;
      color: #9aa8b1;
    }
    .book-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, #FF9933, #e67300);
      color: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .book-btn:hover:not(.disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(255,153,51,0.35);
    }
    .book-btn.disabled {
      background: #dfe7eb;
      color: #9aa8b1;
      cursor: not-allowed;
    }
    .book-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `],
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
