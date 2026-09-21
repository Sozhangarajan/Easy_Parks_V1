import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  template: `
    <div class="rating-widget">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <button
          type="button"
          class="star-btn"
          [class.filled]="star <= (interactive() ? tempRating : value())"
          (mouseenter)="onHover(star)"
          (mouseleave)="onLeave()"
          (click)="onRate(star)"
          [disabled]="!interactive()"
        >
          <mat-icon>{{ star <= (interactive() ? tempRating : value()) ? 'star' : 'star_border' }}</mat-icon>
        </button>
      }
      @if (showValue()) {
        <span class="rating-value">{{ value() | number:'1.1-1' }}</span>
      }
    </div>
  `,
  styles: [`
    .rating-widget { display: inline-flex; align-items: center; gap: 2px; }
    .star-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      transition: transform 0.1s;
    }
    .star-btn:not(:disabled):hover { transform: scale(1.15); }
    .star-btn mat-icon { color: #d1d5db; font-size: 24px; width: 24px; height: 24px; transition: color 0.15s; }
    .star-btn.filled mat-icon { color: #FF9933; }
    .star-btn:disabled { cursor: default; }
    .rating-value { margin-left: 4px; font-size: 14px; font-weight: 500; }
  `],
})
export class RatingComponent {
  value = input(0);
  interactive = input(false);
  showValue = input(false);
  rated = output<number>();

  tempRating = 0;

  onHover(star: number): void {
    if (this.interactive()) this.tempRating = star;
  }

  onLeave(): void {
    if (this.interactive()) this.tempRating = this.value();
  }

  onRate(star: number): void {
    this.tempRating = star;
    this.rated.emit(star);
  }
}
