import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
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
