import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-booking-confirm',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NavbarComponent,
    SpinnerComponent,
  ],
  templateUrl: './booking-confirm.component.html',
  styleUrls: ['./booking-confirm.component.css'],
})
export class BookingConfirmComponent implements OnInit {
  spot = signal<ParkingSpot | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  bookingForm: FormGroup;

  calculatedHours = signal(1);
  calculatedCost = signal(0);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.bookingForm = this.fb.group({
      date: [today, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.spot.set(this.dataService.getSpotById(id) ?? null);
    }

    this.bookingForm.valueChanges.subscribe(() => this.updateCost());
  }

  updateCost(): void {
    const { startTime, endTime } = this.bookingForm.value;
    if (startTime && endTime && this.spot()) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const hours = (eh * 60 + em - (sh * 60 + sm)) / 60;
      if (hours > 0) {
        this.calculatedHours.set(Math.round(hours * 10) / 10);
        this.calculatedCost.set(Math.round(hours * this.spot()!.pricePerHour * 100) / 100);
      }
    }
  }

  async confirmBooking(): Promise<void> {
    if (this.bookingForm.invalid || !this.spot()) return;
    this.loading.set(true);
    this.errorMessage.set('');

    const user = this.authService.user();
    if (!user) {
      this.errorMessage.set('Please log in to book');
      this.loading.set(false);
      return;
    }

    const { date, startTime, endTime } = this.bookingForm.value;
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    this.dataService.createBooking({
      spotId: this.spot()!.id,
      spotName: this.spot()!.name,
      userId: user.uid,
      userName: user.name,
      ownerName: 'Jane Owner',
      startTime: start,
      endTime: end,
      totalHours: this.calculatedHours(),
      totalCost: this.calculatedCost(),
      status: 'pending',
    });

    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/user/my-bookings']);
    }, 800);
  }
}
