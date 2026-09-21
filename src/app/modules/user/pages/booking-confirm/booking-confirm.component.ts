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
  template: `
    <app-navbar title="Confirm Booking" [showBack]="true" />

    <div class="page-content">
      @if (loading()) {
        <app-spinner message="Processing booking..." />
      } @else if (spot()) {
        <div class="spot-summary">
          <img [src]="spot()!.photos[0] || 'https://via.placeholder.com/400x150'" [alt]="spot()!.name" />
          <div class="spot-details">
            <h3>{{ spot()!.name }}</h3>
            <p>{{ spot()!.address }}</p>
          </div>
        </div>

        <form [formGroup]="bookingForm" (ngSubmit)="confirmBooking()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date</mat-label>
            <input matInput formControlName="date" type="date" />
            <mat-icon matPrefix>calendar_today</mat-icon>
            @if (bookingForm.get('date')?.hasError('required')) {
              <mat-error>Date is required</mat-error>
            }
          </mat-form-field>

          <div class="time-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Start Time</mat-label>
              <input matInput formControlName="startTime" type="time" />
              @if (bookingForm.get('startTime')?.hasError('required')) {
                <mat-error>Required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>End Time</mat-label>
              <input matInput formControlName="endTime" type="time" />
              @if (bookingForm.get('endTime')?.hasError('required')) {
                <mat-error>Required</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="cost-summary">
            <div class="cost-row">
              <span>Rate</span>
              <span>\${{ spot()!.pricePerHour }}/hour</span>
            </div>
            <div class="cost-row">
              <span>Hours</span>
              <span>{{ calculatedHours() }}</span>
            </div>
            <div class="cost-row total">
              <span>Total</span>
              <span>\${{ calculatedCost() }}</span>
            </div>
          </div>

          @if (errorMessage()) {
            <div class="error-message">{{ errorMessage() }}</div>
          }

          <button
            mat-flat-button
            type="submit"
            class="full-width confirm-btn"
            [disabled]="bookingForm.invalid || loading()"
          >
            Confirm Booking
          </button>
        </form>
      }
    </div>
  `,
  styles: [`
    .page-content { padding: 64px 16px 24px; }
    .full-width { width: 100%; }
    .spot-summary {
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
      border: 1px solid #e5e7eb;
    }
    .spot-summary img { width: 100%; height: 150px; object-fit: cover; }
    .spot-details { padding: 12px 16px; }
    .spot-details h3 { margin: 0 0 4px; }
    .spot-details p { margin: 0; font-size: 13px; color: #6b7280; }
    .time-row { display: flex; gap: 12px; }
    .half-width { flex: 1; }
    .cost-summary {
      padding: 16px;
      background: #f3f4f6;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .cost-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .cost-row.total {
      border-top: 1px solid #e5e7eb;
      margin-top: 8px;
      padding-top: 12px;
      font-weight: 600;
      font-size: 18px;
      color: #FF9933;
    }
    .error-message {
      color: #dc2626;
      font-size: 13px;
      margin-bottom: 12px;
      text-align: center;
    }
    .confirm-btn {
      height: 48px;
      font-size: 16px;
      border-radius: 12px;
      background: #FF9933;
      color: white;
    }
  `],
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
