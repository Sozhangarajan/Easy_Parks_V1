import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-add-edit-spot',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    SpinnerComponent,
  ],
  templateUrl: './add-edit-spot.component.html',
  styleUrls: ['./add-edit-spot.component.css'],
})
export class AddEditSpotComponent implements OnInit {
  spotForm: FormGroup;
  isEdit = signal(false);
  loading = signal(false);
  editId = signal<string | null>(null);
  photos = signal<string[]>([]);

  parkingTypes = [
    { value: 'open', label: 'Open Air', icon: 'wb_sunny' },
    { value: 'covered', label: 'Covered', icon: 'umbrella' },
    { value: 'underground', label: 'Underground', icon: 'vertical_align_bottom' },
    { value: 'multi-level', label: 'Multi-Level', icon: 'layers' },
    { value: 'valet', label: 'Valet', icon: 'hail' },
  ];

  amenityOptions = [
    { value: 'ev-charging', label: 'EV Charging', icon: 'ev_station' },
    { value: 'cctv', label: 'CCTV', icon: 'videocam' },
    { value: 'security-guard', label: 'Security Guard', icon: 'security' },
    { value: 'wheelchair', label: 'Wheelchair Access', icon: 'accessible' },
    { value: 'covered', label: 'Covered', icon: 'roofing' },
    { value: 'car-wash', label: 'Car Wash', icon: 'local_car_wash' },
    { value: 'restroom', label: 'Restroom', icon: 'wc' },
    { value: 'wifi', label: 'WiFi', icon: 'wifi' },
    { value: 'valet', label: 'Valet', icon: 'hail' },
  ];

  vehicleTypes = [
    { value: 'compact', label: 'Compact', icon: 'directions_car' },
    { value: 'sedan', label: 'Sedan', icon: 'directions_car' },
    { value: 'suv', label: 'SUV', icon: 'local_shipping' },
    { value: 'motorcycle', label: 'Motorcycle', icon: 'two_wheeler' },
    { value: 'truck', label: 'Truck', icon: 'airport_shuttle' },
    { value: 'ev', label: 'Electric', icon: 'electric_car' },
  ];

  hoursOptions = [
    { value: '24/7', label: '24/7', icon: 'all_inclusive' },
    { value: '6am-10pm', label: '6 AM - 10 PM', icon: 'schedule' },
    { value: '7am-11pm', label: '7 AM - 11 PM', icon: 'schedule' },
    { value: '8am-10pm', label: '8 AM - 10 PM', icon: 'schedule' },
    { value: 'custom', label: 'Custom', icon: 'edit' },
  ];

  cancellationPolicies = [
    { value: 'flexible', label: 'Flexible', icon: 'mood' },
    { value: 'moderate', label: 'Moderate', icon: 'sentiment_neutral' },
    { value: 'strict', label: 'Strict', icon: 'mood_bad' },
  ];

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
      peakPrice: [8],
      totalSlots: [50, [Validators.required, Validators.min(1)]],
      availableSlots: [50, Validators.required],
      operatingHours: ['24/7'],
      openTime: ['06:00'],
      closeTime: ['22:00'],
      description: [''],
      parkingType: ['open', Validators.required],
      amenities: [[]],
      vehicleTypes: [[]],
      contactPhone: [''],
      emergencyContact: [''],
      cancellationPolicy: ['flexible'],
      photoUrl: [''],
      isActive: [true],
      instantBooking: [true],
      notifications: [true],
      autoApprove: [false],
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
        this.photos.set(spot.photos || []);
      }
    }
  }

  getProgress(): number {
    const fields = ['name', 'address', 'pricePerHour', 'totalSlots', 'availableSlots', 'parkingType'];
    const filled = fields.filter(f => this.spotForm.value[f] && this.spotForm.value[f] !== '').length;
    return Math.round((filled / fields.length) * 100);
  }

  getCapacityPercent(): number {
    const total = this.spotForm.value.totalSlots || 1;
    const available = this.spotForm.value.availableSlots || 0;
    return Math.round((available / total) * 100);
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.spotForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  toggleAmenity(value: string): void {
    const current = this.spotForm.value.amenities || [];
    const idx = current.indexOf(value);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    this.spotForm.patchValue({ amenities: [...current] });
  }

  toggleVehicleType(value: string): void {
    const current = this.spotForm.value.vehicleTypes || [];
    const idx = current.indexOf(value);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    this.spotForm.patchValue({ vehicleTypes: [...current] });
  }

  addPhoto(): void {
    this.photos.update(p => [...p, 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400']);
  }

  addPhotoFromUrl(): void {
    const url = this.spotForm.value.photoUrl;
    if (url) {
      this.photos.update(p => [...p, url]);
      this.spotForm.patchValue({ photoUrl: '' });
    }
  }

  removePhoto(index: number): void {
    this.photos.update(p => p.filter((_, i) => i !== index));
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.spotForm.patchValue({
            latitude: parseFloat(pos.coords.latitude.toFixed(4)),
            longitude: parseFloat(pos.coords.longitude.toFixed(4)),
          });
        },
        () => { /* denied or error */ }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/owner/listings']);
  }

  onSubmit(): void {
    if (this.spotForm.invalid) return;
    this.loading.set(true);

    const user = this.authService.user();
    const formValue = { ...this.spotForm.value, photos: this.photos() };
    delete formValue.photoUrl;

    setTimeout(() => {
      if (this.isEdit() && this.editId()) {
        this.dataService.updateSpot(this.editId()!, formValue);
      } else {
        this.dataService.addSpot({
          ...formValue,
          ownerId: user?.uid || '',
          photos: this.photos().length ? this.photos() : ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400'],
        });
      }
      this.loading.set(false);
      this.router.navigate(['/owner/listings']);
    }, 800);
  }
}
