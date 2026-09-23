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
  templateUrl: './spot-card.component.html',
  styleUrls: ['./spot-card.component.css'],
})
export class SpotCardComponent {
  spot = input.required<ParkingSpot>();
  clicked = output<ParkingSpot>();

  onCardClick(): void {
    this.clicked.emit(this.spot());
  }
}
