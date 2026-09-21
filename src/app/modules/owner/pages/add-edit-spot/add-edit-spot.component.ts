import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-add-edit-spot',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    NavbarComponent,
    SpinnerComponent,
  ],
  template: `
    <app-navbar [title]="isEdit() ? 'Edit Parking Spot' : 'Add Parking Spot'" [showBack]="true" />

    <div class="page-content">
      @if (loading()) {
        <app-spinner [fullscreen]="true" message="Saving..." />
      }

      <form [formGroup]="spotForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Spot Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Central City Parking" />
          <mat-icon matPrefix>local_parking</mat-icon>
          @if (spotForm.get('name')?.hasError('required') && spotForm.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address" placeholder="Full address" />
          <mat-icon matPrefix>location_on</mat-icon>
          @if (spotForm.get('address')?.hasError('required') && spotForm.get('address')?.touched) {
            <mat-error>Address is required</mat-error>
          }
        </mat-form-field>

        <div class="coords-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Latitude</mat-label>
            <input matInput formControlName="latitude" type="number" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Longitude</mat-label>
            <input matInput formControlName="longitude" type="number" />
          </mat-form-field>
        </div>

        <div class="map-placeholder">
          <mat-icon>map</mat-icon>
          <span>Map picker will be integrated here</span>
        </div>

        <div class="slots-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Price per Hour (\$)</mat-label>
            <input matInput formControlName="pricePerHour" type="number" min="1" />
            <mat-icon matPrefix>payments</mat-icon>
            @if (spotForm.get('pricePerHour')?.hasError('required')) {
              <mat-error>Required</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Total Slots</mat-label>
            <input matInput formControlName="totalSlots" type="number" min="1" />
            @if (spotForm.get('totalSlots')?.hasError('required')) {
              <mat-error>Required</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Available Slots</mat-label>
          <input matInput formControlName="availableSlots" type="number" min="0" />
          @if (spotForm.get('availableSlots')?.hasError('required')) {
            <mat-error>Required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Operating Hours</mat-label>
          <input matInput formControlName="operatingHours" placeholder="e.g. 24/7" />
          <mat-icon matPrefix>schedule</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Describe your parking spot"></textarea>
        </mat-form-field>

        <mat-checkbox formControlName="isActive" class="active-checkbox">
          Active (visible to users)
        </mat-checkbox>

        <button mat-flat-button type="submit" class="full-width submit-btn" [disabled]="spotForm.invalid || loading()">
          {{ isEdit() ? 'Update Spot' : 'Add Spot' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 64px 16px 24px; }
    .full-width { width: 100%; }
    .coords-row, .slots-row { display: flex; gap: 12px; }
    .half-width { flex: 1; }
    .map-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 120px;
      border: 2px dashed #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
      color: #6b7280;
      font-size: 14px;
    }
    .active-checkbox { margin-bottom: 16px; }
    .submit-btn {
      height: 48px;
      font-size: 16px;
      border-radius: 12px;
      background: #FF9933;
      color: white;
    }
  `],
})
export class AddEditSpotComponent implements OnInit {
  spotForm: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  editId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.spotForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [40.7128, Validators.required],
      longitude: [-74.006, Validators.required],
      pricePerHour: [5, [Validators.required, Validators.min(1)]],
      totalSlots: [50, [Validators.required, Validators.min(1)]],
      availableSlots: [50, Validators.required],
      operatingHours: ['24/7'],
      description: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(id);
      const spot = this.dataService.getSpotById(id);
      if (spot) {
        this.spotForm.patchValue(spot);
      }
    }
  }

  onSubmit(): void {
    if (this.spotForm.invalid) return;
    this.loading.set(true);

    const user = this.authService.user();
    const formValue = this.spotForm.value;

    setTimeout(() => {
      if (this.isEdit() && this.editId()) {
        this.dataService.updateSpot(this.editId()!, formValue);
      } else {
        this.dataService.addSpot({
          ...formValue,
          ownerId: user?.uid || '',
          photos: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400'],
        });
      }
      this.loading.set(false);
      this.router.navigate(['/owner/listings']);
    }, 800);
  }
}
