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
  template: `
    <div class="add-edit-page">

      <!-- ===== HERO HEADER ===== -->
      <div class="hero-header">
        <div class="hero-bg"></div>
        <div class="anim-layer">
          <div class="float-shape fs-1"><mat-icon>local_parking</mat-icon></div>
          <div class="float-shape fs-2"><mat-icon>add_location</mat-icon></div>
          <div class="float-shape fs-3"><mat-icon>ev_station</mat-icon></div>
          <div class="float-shape fs-4"><mat-icon>security</mat-icon></div>
          <div class="float-shape fs-5"><mat-icon>payments</mat-icon></div>
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <svg class="grid-lines" viewBox="0 0 400 250" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="400" y2="250" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <line x1="100" y1="0" x2="500" y2="250" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
            <line x1="200" y1="0" x2="600" y2="250" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          </svg>
        </div>
        <div class="hero-content">
          <button class="back-btn" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="hero-title-group">
            <div class="hero-icon-wrap">
              <mat-icon>{{ isEdit() ? 'edit' : 'add_location' }}</mat-icon>
            </div>
            <h1>{{ isEdit() ? 'Edit Spot' : 'New Spot' }}</h1>
            <p class="hero-sub">{{ isEdit() ? 'Update your parking spot details' : 'List your parking space' }}</p>
          </div>
        </div>
      </div>

      <!-- ===== PROGRESS BAR ===== -->
      <div class="progress-bar-wrap">
        <div class="progress-bar" [style.width]="getProgress() + '%'"></div>
        <span class="progress-text">{{ getProgress() }}% Complete</span>
      </div>

      <!-- ===== FORM CONTENT ===== -->
      <div class="form-content">
        @if (loading()) {
          <app-spinner [fullscreen]="true" message="Saving your spot..." />
        }

        <form [formGroup]="spotForm" (ngSubmit)="onSubmit()">

          <!-- SECTION 1: Basic Info -->
          <div class="form-section" [class.visible]="true">
            <div class="section-header">
              <div class="section-icon si-blue"><mat-icon>info</mat-icon></div>
              <div>
                <h2>Basic Information</h2>
                <p>Tell us about your parking spot</p>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Spot Name <span class="required">*</span></label>
              <div class="input-wrap" [class.has-error]="isFieldInvalid('name')">
                <mat-icon class="field-icon">local_parking</mat-icon>
                <input type="text" formControlName="name" placeholder="e.g. Central City Parking" class="custom-input" />
              </div>
              @if (isFieldInvalid('name')) {
                <span class="error-msg">Spot name is required</span>
              }
            </div>

            <div class="field-group">
              <label class="field-label">Address <span class="required">*</span></label>
              <div class="input-wrap" [class.has-error]="isFieldInvalid('address')">
                <mat-icon class="field-icon">location_on</mat-icon>
                <input type="text" formControlName="address" placeholder="Full street address" class="custom-input" />
              </div>
              @if (isFieldInvalid('address')) {
                <span class="error-msg">Address is required</span>
              }
            </div>

            <div class="field-group">
              <label class="field-label">Description</label>
              <div class="input-wrap textarea-wrap">
                <textarea formControlName="description" rows="3" placeholder="Describe your parking spot..." class="custom-input custom-textarea"></textarea>
              </div>
            </div>

            <div class="coords-row">
              <div class="field-group">
                <label class="field-label">Latitude</label>
                <div class="input-wrap">
                  <mat-icon class="field-icon">my_location</mat-icon>
                  <input type="number" formControlName="latitude" class="custom-input" step="0.0001" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Longitude</label>
                <div class="input-wrap">
                  <mat-icon class="field-icon">my_location</mat-icon>
                  <input type="number" formControlName="longitude" class="custom-input" step="0.0001" />
                </div>
              </div>
            </div>

            <div class="map-preview">
              <mat-icon>map</mat-icon>
              <span>Map location preview</span>
              <button type="button" class="map-btn" (click)="getCurrentLocation()">
                <mat-icon>my_location</mat-icon>
                Get Current Location
              </button>
            </div>
          </div>

          <!-- SECTION 2: Pricing & Capacity -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon si-green"><mat-icon>payments</mat-icon></div>
              <div>
                <h2>Pricing & Capacity</h2>
                <p>Set your rates and parking capacity</p>
              </div>
            </div>

            <div class="pricing-card">
              <div class="pricing-row">
                <div class="field-group">
                  <label class="field-label">Price per Hour <span class="required">*</span></label>
                  <div class="input-wrap price-input" [class.has-error]="isFieldInvalid('pricePerHour')">
                    <span class="currency-symbol">$</span>
                    <input type="number" formControlName="pricePerHour" min="1" class="custom-input price-field" />
                  </div>
                  @if (isFieldInvalid('pricePerHour')) {
                    <span class="error-msg">Minimum $1/hour</span>
                  }
                </div>
                <div class="field-group">
                  <label class="field-label">Peak Hour Price</label>
                  <div class="input-wrap price-input">
                    <span class="currency-symbol">$</span>
                    <input type="number" formControlName="peakPrice" min="1" class="custom-input price-field" />
                  </div>
                </div>
              </div>

              <div class="price-preview">
                <div class="price-tag">
                  <mat-icon>schedule</mat-icon>
                  <span>Regular: <strong>\${{ spotForm.value.pricePerHour || 0 }}/hr</strong></span>
                </div>
                <div class="price-tag peak">
                  <mat-icon>trending_up</mat-icon>
                  <span>Peak: <strong>\${{ spotForm.value.peakPrice || 0 }}/hr</strong></span>
                </div>
              </div>
            </div>

            <div class="slots-row">
              <div class="field-group">
                <label class="field-label">Total Slots <span class="required">*</span></label>
                <div class="input-wrap" [class.has-error]="isFieldInvalid('totalSlots')">
                  <mat-icon class="field-icon">grid_view</mat-icon>
                  <input type="number" formControlName="totalSlots" min="1" class="custom-input" />
                </div>
                @if (isFieldInvalid('totalSlots')) {
                  <span class="error-msg">Required</span>
                }
              </div>
              <div class="field-group">
                <label class="field-label">Available Slots <span class="required">*</span></label>
                <div class="input-wrap" [class.has-error]="isFieldInvalid('availableSlots')">
                  <mat-icon class="field-icon">check_circle</mat-icon>
                  <input type="number" formControlName="availableSlots" min="0" class="custom-input" />
                </div>
                @if (isFieldInvalid('availableSlots')) {
                  <span class="error-msg">Required</span>
                }
              </div>
            </div>

            <div class="capacity-bar">
              <div class="capacity-fill" [style.width]="getCapacityPercent() + '%'"></div>
              <span class="capacity-label">{{ getCapacityPercent() }}% capacity available</span>
            </div>
          </div>

          <!-- SECTION 3: Parking Type & Amenities -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon si-purple"><mat-icon>star</mat-icon></div>
              <div>
                <h2>Type & Amenities</h2>
                <p>What makes your spot special</p>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Parking Type <span class="required">*</span></label>
              <div class="chip-grid">
                @for (type of parkingTypes; track type.value) {
                  <button type="button"
                    class="type-chip"
                    [class.selected]="spotForm.value.parkingType === type.value"
                    (click)="spotForm.patchValue({ parkingType: type.value })">
                    <mat-icon>{{ type.icon }}</mat-icon>
                    <span>{{ type.label }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Amenities</label>
              <div class="amenity-grid">
                @for (amenity of amenityOptions; track amenity.value) {
                  <button type="button"
                    class="amenity-chip"
                    [class.selected]="spotForm.value.amenities?.includes(amenity.value)"
                    (click)="toggleAmenity(amenity.value)">
                    <mat-icon>{{ amenity.icon }}</mat-icon>
                    <span>{{ amenity.label }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Vehicle Types Allowed</label>
              <div class="vehicle-grid">
                @for (v of vehicleTypes; track v.value) {
                  <button type="button"
                    class="vehicle-chip"
                    [class.selected]="spotForm.value.vehicleTypes?.includes(v.value)"
                    (click)="toggleVehicleType(v.value)">
                    <mat-icon>{{ v.icon }}</mat-icon>
                    <span>{{ v.label }}</span>
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- SECTION 4: Hours & Contact -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon si-orange"><mat-icon>schedule</mat-icon></div>
              <div>
                <h2>Hours & Contact</h2>
                <p>When are you open and how to reach you</p>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Operating Hours</label>
              <div class="hours-grid">
                @for (h of hoursOptions; track h.value) {
                  <button type="button"
                    class="hours-chip"
                    [class.selected]="spotForm.value.operatingHours === h.value"
                    (click)="spotForm.patchValue({ operatingHours: h.value })">
                    <mat-icon>{{ h.icon }}</mat-icon>
                    <span>{{ h.label }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Custom Hours</label>
              <div class="time-row">
                <div class="input-wrap time-input">
                  <mat-icon class="field-icon">access_time</mat-icon>
                  <input type="time" formControlName="openTime" class="custom-input" />
                </div>
                <span class="time-separator">to</span>
                <div class="input-wrap time-input">
                  <mat-icon class="field-icon">access_time</mat-icon>
                  <input type="time" formControlName="closeTime" class="custom-input" />
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Contact Phone</label>
              <div class="input-wrap">
                <mat-icon class="field-icon">phone</mat-icon>
                <input type="tel" formControlName="contactPhone" placeholder="+1 (555) 123-4567" class="custom-input" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Emergency Contact</label>
              <div class="input-wrap">
                <mat-icon class="field-icon">emergency</mat-icon>
                <input type="tel" formControlName="emergencyContact" placeholder="24/7 support number" class="custom-input" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Cancellation Policy</label>
              <div class="hours-grid">
                @for (p of cancellationPolicies; track p.value) {
                  <button type="button"
                    class="hours-chip"
                    [class.selected]="spotForm.value.cancellationPolicy === p.value"
                    (click)="spotForm.patchValue({ cancellationPolicy: p.value })">
                    <mat-icon>{{ p.icon }}</mat-icon>
                    <span>{{ p.label }}</span>
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- SECTION 5: Photos -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon si-teal"><mat-icon>photo_camera</mat-icon></div>
              <div>
                <h2>Photos</h2>
                <p>Upload images of your parking spot</p>
              </div>
            </div>

            <div class="photo-grid">
              @for (photo of photos(); track $index; let i = $index) {
                <div class="photo-card">
                  <div class="photo-thumb">
                    <mat-icon>image</mat-icon>
                  </div>
                  <button type="button" class="photo-remove" (click)="removePhoto(i)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              }
              <button type="button" class="photo-add" (click)="addPhoto()">
                <mat-icon>add_a_photo</mat-icon>
                <span>Add Photo</span>
              </button>
            </div>

            <div class="field-group">
              <label class="field-label">Or paste image URL</label>
              <div class="input-wrap">
                <mat-icon class="field-icon">link</mat-icon>
                <input type="url" formControlName="photoUrl" placeholder="https://example.com/photo.jpg" class="custom-input" />
                <button type="button" class="input-action" (click)="addPhotoFromUrl()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- SECTION 6: Settings -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon si-red"><mat-icon>tune</mat-icon></div>
              <div>
                <h2>Settings</h2>
                <p>Final configuration options</p>
              </div>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>visibility</mat-icon>
                <div>
                  <span class="toggle-label">Active Listing</span>
                  <span class="toggle-desc">Visible to users for booking</span>
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" formControlName="isActive" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>verified</mat-icon>
                <div>
                  <span class="toggle-label">Instant Booking</span>
                  <span class="toggle-desc">Allow immediate reservations</span>
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" formControlName="instantBooking" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>notifications_active</mat-icon>
                <div>
                  <span class="toggle-label">Booking Notifications</span>
                  <span class="toggle-desc">Get notified on new bookings</span>
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" formControlName="notifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <mat-icon>auto_awesome</mat-icon>
                <div>
                  <span class="toggle-label">Auto-approve Bookings</span>
                  <span class="toggle-desc">Automatically confirm reservations</span>
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" formControlName="autoApprove" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- SUBMIT -->
          <div class="submit-section">
            <button type="button" class="btn-cancel" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn-submit" [disabled]="spotForm.invalid || loading()">
              <mat-icon>{{ isEdit() ? 'save' : 'add_circle' }}</mat-icon>
              {{ isEdit() ? 'Update Spot' : 'Create Spot' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --teal-dark: #0b2f4a;
      --teal-mid: #12587a;
      --teal-light: #2f9bbf;
      --teal-accent: #0f7173;
      --gold: #f2c94c;
      --saffron: #FF9933;
      --bg: #f0f5f7;
      --card: #ffffff;
      --text: #1a1a2e;
      --text-sec: #64748b;
      --border: #e2e8f0;
      --success: #10b981;
      --error: #ef4444;
      --purple: #8b5cf6;
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--bg);
      min-height: 100vh;
    }

    /* ===== HERO ===== */
    .hero-header {
      position: relative;
      overflow: hidden;
      padding: 0 0 40px;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--teal-dark) 0%, var(--teal-mid) 40%, var(--teal-light) 70%, var(--teal-accent) 100%);
    }
    .anim-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .float-shape {
      position: absolute;
      opacity: 0.07;
      color: white;
      animation: floatUp 18s ease-in-out infinite;
    }
    .float-shape mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .fs-1 { top: 10%; left: 5%; animation-delay: 0s; }
    .fs-2 { top: 60%; right: 10%; animation-delay: 3s; }
    .fs-3 { top: 30%; left: 60%; animation-delay: 6s; }
    .fs-4 { bottom: 20%; left: 20%; animation-delay: 9s; }
    .fs-5 { top: 50%; left: 40%; animation-delay: 12s; }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      animation: orbFloat 12s ease-in-out infinite;
    }
    .orb-1 {
      width: 200px; height: 200px;
      background: rgba(242,201,76,0.15);
      top: -50px; right: -50px;
    }
    .orb-2 {
      width: 150px; height: 150px;
      background: rgba(255,153,51,0.12);
      bottom: -30px; left: -30px;
      animation-delay: 4s;
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    @keyframes floatUp {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(20px, -15px) scale(1.1); }
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 20px 20px 0;
    }
    .back-btn {
      width: 40px; height: 40px;
      border-radius: 12px;
      border: none;
      background: rgba(255,255,255,0.15);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
      margin-bottom: 16px;
    }
    .back-btn:hover { background: rgba(255,255,255,0.25); transform: translateX(-2px); }

    .hero-title-group { text-align: center; }
    .hero-icon-wrap {
      width: 64px; height: 64px;
      border-radius: 20px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .hero-icon-wrap mat-icon {
      font-size: 32px; width: 32px; height: 32px; color: white;
    }
    .hero-content h1 {
      color: white;
      font-size: 26px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .hero-sub {
      color: rgba(255,255,255,0.7);
      font-size: 14px;
      margin: 4px 0 0;
    }

    /* ===== PROGRESS ===== */
    .progress-bar-wrap {
      position: relative;
      height: 6px;
      background: var(--border);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--saffron), var(--gold));
      border-radius: 0 3px 3px 0;
      transition: width 0.5s ease;
    }
    .progress-text {
      position: absolute;
      right: 12px;
      top: 10px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-sec);
    }

    /* ===== FORM CONTENT ===== */
    .form-content {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    /* ===== FORM SECTIONS ===== */
    .form-section {
      background: var(--card);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }
    .section-icon {
      width: 44px; height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .section-icon mat-icon { font-size: 22px; width: 22px; height: 22px; color: white; }
    .si-blue { background: linear-gradient(135deg, var(--teal-light), var(--teal-mid)); }
    .si-green { background: linear-gradient(135deg, #10b981, #059669); }
    .si-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
    .si-orange { background: linear-gradient(135deg, var(--saffron), #ea580c); }
    .si-teal { background: linear-gradient(135deg, #14b8a6, #0d9488); }
    .si-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

    .section-header h2 {
      font-size: 17px;
      font-weight: 700;
      color: var(--text);
      margin: 0;
    }
    .section-header p {
      font-size: 12px;
      color: var(--text-sec);
      margin: 2px 0 0;
    }

    /* ===== FIELDS ===== */
    .field-group {
      margin-bottom: 16px;
    }
    .field-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 6px;
    }
    .required { color: var(--error); }
    .input-wrap {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 0 14px;
      transition: all 0.3s;
    }
    .input-wrap:focus-within {
      border-color: var(--teal-light);
      background: white;
      box-shadow: 0 0 0 4px rgba(47,155,191,0.1);
    }
    .input-wrap.has-error {
      border-color: var(--error);
      box-shadow: 0 0 0 4px rgba(239,68,68,0.1);
    }
    .field-icon {
      color: var(--text-sec);
      margin-right: 10px;
      font-size: 20px;
    }
    .custom-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 12px 0;
      font-size: 14px;
      font-family: inherit;
      color: var(--text);
      outline: none;
      width: 100%;
    }
    .custom-input::placeholder { color: #94a3b8; }
    .custom-textarea { resize: vertical; min-height: 70px; }
    .textarea-wrap { align-items: flex-start; padding: 12px 14px; }
    .input-action {
      width: 32px; height: 32px;
      border-radius: 8px;
      border: none;
      background: var(--teal-light);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      margin-left: 8px;
      transition: all 0.2s;
    }
    .input-action:hover { background: var(--teal-mid); }
    .error-msg {
      font-size: 12px;
      color: var(--error);
      margin-top: 4px;
      display: block;
    }

    .coords-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .map-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 100px;
      border: 2px dashed var(--border);
      border-radius: 14px;
      color: var(--text-sec);
      font-size: 13px;
      position: relative;
      flex-wrap: wrap;
    }
    .map-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      border: none;
      background: var(--teal-light);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .map-btn:hover { background: var(--teal-mid); transform: translateY(-1px); }
    .map-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* ===== PRICING ===== */
    .pricing-card {
      background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 16px;
      border: 1px solid #d1fae5;
    }
    .pricing-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .price-input {
      padding: 0 8px 0 0;
    }
    .currency-symbol {
      font-size: 20px;
      font-weight: 700;
      color: var(--teal-mid);
      padding: 0 8px 0 14px;
    }
    .price-field {
      font-size: 22px;
      font-weight: 700;
      color: var(--teal-dark);
    }
    .price-preview {
      display: flex;
      gap: 12px;
      margin-top: 14px;
    }
    .price-tag {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      background: white;
      border-radius: 10px;
      font-size: 13px;
      color: var(--text-sec);
      border: 1px solid #d1fae5;
    }
    .price-tag mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--success); }
    .price-tag strong { color: var(--text); font-weight: 700; }
    .price-tag.peak { border-color: #fef3c7; background: #fffbeb; }
    .price-tag.peak mat-icon { color: var(--saffron); }

    .slots-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .capacity-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      margin-top: 8px;
      position: relative;
      overflow: hidden;
    }
    .capacity-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--success), #34d399);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .capacity-label {
      font-size: 11px;
      color: var(--text-sec);
      margin-top: 4px;
      display: block;
    }

    /* ===== CHIPS ===== */
    .chip-grid, .amenity-grid, .vehicle-grid, .hours-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .type-chip, .amenity-chip, .vehicle-chip, .hours-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: 12px;
      border: 2px solid var(--border);
      background: white;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-sec);
      cursor: pointer;
      transition: all 0.3s;
      font-family: inherit;
    }
    .type-chip mat-icon, .amenity-chip mat-icon, .vehicle-chip mat-icon, .hours-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .type-chip:hover, .amenity-chip:hover, .vehicle-chip:hover, .hours-chip:hover {
      border-color: var(--teal-light);
      color: var(--teal-mid);
    }
    .type-chip.selected {
      background: linear-gradient(135deg, var(--teal-light), var(--teal-mid));
      border-color: var(--teal-mid);
      color: white;
      box-shadow: 0 4px 12px rgba(47,155,191,0.3);
    }
    .amenity-chip.selected {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border-color: #7c3aed;
      color: white;
      box-shadow: 0 4px 12px rgba(139,92,246,0.3);
    }
    .vehicle-chip.selected {
      background: linear-gradient(135deg, var(--saffron), #ea580c);
      border-color: var(--saffron);
      color: white;
      box-shadow: 0 4px 12px rgba(255,153,51,0.3);
    }
    .hours-chip.selected {
      background: linear-gradient(135deg, var(--success), #059669);
      border-color: var(--success);
      color: white;
      box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    }

    /* ===== TIME ROW ===== */
    .time-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .time-input { flex: 1; }
    .time-separator {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-sec);
    }

    /* ===== PHOTOS ===== */
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .photo-card {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      aspect-ratio: 1;
      border: 2px solid var(--border);
    }
    .photo-thumb {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
    }
    .photo-thumb mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--text-sec); }
    .photo-remove {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: var(--error);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .photo-card:hover .photo-remove { opacity: 1; }
    .photo-remove mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .photo-add {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border-radius: 14px;
      border: 2px dashed var(--border);
      background: transparent;
      color: var(--text-sec);
      cursor: pointer;
      transition: all 0.3s;
      font-family: inherit;
      font-size: 12px;
      aspect-ratio: 1;
    }
    .photo-add:hover {
      border-color: var(--teal-light);
      color: var(--teal-mid);
      background: rgba(47,155,191,0.05);
    }
    .photo-add mat-icon { font-size: 28px; width: 28px; height: 28px; }

    /* ===== TOGGLES ===== */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .toggle-row:last-child { border-bottom: none; }
    .toggle-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toggle-info > mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--teal-light);
    }
    .toggle-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }
    .toggle-desc {
      display: block;
      font-size: 12px;
      color: var(--text-sec);
      margin-top: 1px;
    }
    .toggle-switch {
      position: relative;
      width: 48px;
      height: 26px;
      flex-shrink: 0;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute;
      inset: 0;
      background: #cbd5e1;
      border-radius: 26px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: 3px;
      transition: all 0.3s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, var(--teal-light), var(--teal-mid));
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(22px);
    }

    /* ===== SUBMIT ===== */
    .submit-section {
      display: flex;
      gap: 12px;
      padding: 8px 0 40px;
    }
    .btn-cancel {
      flex: 1;
      padding: 16px;
      border-radius: 14px;
      border: 2px solid var(--border);
      background: white;
      color: var(--text-sec);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-family: inherit;
    }
    .btn-cancel:hover { border-color: var(--text-sec); color: var(--text); }
    .btn-submit {
      flex: 2;
      padding: 16px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, var(--saffron), #ea580c);
      color: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(255,153,51,0.35);
      font-family: inherit;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255,153,51,0.45);
    }
    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .btn-submit mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `],
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
