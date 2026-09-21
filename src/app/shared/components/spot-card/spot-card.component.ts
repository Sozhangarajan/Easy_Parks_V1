import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
import { ParkingSpot } from '../../../core/models/parking-spot.model';

@Component({
  selector: 'app-spot-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, DecimalPipe],
  template: `
    <mat-card class="spot-card" (click)="onCardClick()">
      <div class="card-image">
        <img [src]="spot().photos[0] || 'https://via.placeholder.com/400x200'" [alt]="spot().name" />
        @if (spot().availableSlots === 0) {
          <div class="full-badge">Full</div>
        }
      </div>
      <mat-card-content>
        <div class="card-header">
          <h3 class="spot-name">{{ spot().name }}</h3>
          @if (spot().rating > 0) {
            <div class="rating">
              <mat-icon class="star-icon">star</mat-icon>
              <span>{{ spot().rating | number:'1.1-1' }}</span>
              <span class="review-count">({{ spot().reviewCount }})</span>
            </div>
          }
        </div>
        <p class="address">
          <mat-icon class="loc-icon">location_on</mat-icon>
          {{ spot().address }}
        </p>
        <div class="card-footer">
          <span class="price">\${{ spot().pricePerHour }}/hr</span>
          <span class="slots" [class.full]="spot().availableSlots === 0">
            {{ spot().availableSlots }}/{{ spot().totalSlots }} slots
          </span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .spot-card {
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-bottom: 12px;
    }
    .spot-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .card-image {
      position: relative;
      height: 140px;
      overflow: hidden;
    }
    .card-image img { width: 100%; height: 100%; object-fit: cover; }
    .full-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #dc2626;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    mat-card-content { padding: 12px 16px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .spot-name { margin: 0; font-size: 16px; font-weight: 500; }
    .rating { display: flex; align-items: center; gap: 2px; font-size: 13px; }
    .star-icon { font-size: 16px; width: 16px; height: 16px; color: #FF9933; }
    .review-count { color: #6b7280; font-size: 12px; }
    .address { display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 13px; margin: 4px 0; }
    .loc-icon { font-size: 14px; width: 14px; height: 14px; }
    .card-footer { display: flex; justify-content: space-between; margin-top: 8px; }
    .price { font-weight: 600; color: #FF9933; }
    .slots { font-size: 13px; color: #6b7280; }
    .slots.full { color: #dc2626; font-weight: 500; }
  `],
})
export class SpotCardComponent {
  spot = input.required<ParkingSpot>();
  clicked = output<ParkingSpot>();

  onCardClick(): void {
    this.clicked.emit(this.spot());
  }
}
