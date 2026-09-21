import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpinnerComponent,
  ],
  template: `
    <div class="listings-page">

      <!-- ===== HERO HEADER ===== -->
      <div class="hero-header">
        <div class="hero-bg"></div>
        <div class="anim-layer">
          <div class="float-shape fs-1"><mat-icon>local_parking</mat-icon></div>
          <div class="float-shape fs-2"><mat-icon>edit</mat-icon></div>
          <div class="float-shape fs-3"><mat-icon>toggle_on</mat-icon></div>
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
        </div>

        <div class="hero-content">
          <h1>My Listings</h1>
          <p class="hero-sub">Manage your parking spots</p>

          <!-- STATS -->
          <div class="stats-row">
            <div class="stat-pill">
              <span class="stat-num">{{ spots().length }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-pill sp-active">
              <span class="stat-num">{{ activeCount() }}</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat-pill sp-inactive">
              <span class="stat-num">{{ inactiveCount() }}</span>
              <span class="stat-label">Inactive</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="main-content">

        <!-- FILTER CHIPS -->
        <div class="filter-chips">
          <button class="chip" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">
            <mat-icon>grid_view</mat-icon>
            All
          </button>
          <button class="chip" [class.active]="activeFilter() === 'active'" (click)="setFilter('active')">
            <mat-icon>check_circle</mat-icon>
            Active
          </button>
          <button class="chip" [class.active]="activeFilter() === 'inactive'" (click)="setFilter('inactive')">
            <mat-icon>pause_circle</mat-icon>
            Inactive
          </button>
        </div>

        @if (loading()) {
          <app-spinner message="Loading listings..." />
        } @else if (filteredSpots().length === 0) {
          <div class="empty-wrap">
            <div class="empty-illustration">
              <mat-icon>local_parking</mat-icon>
            </div>
            <h3>No listings yet</h3>
            <p>Add your first parking spot to start earning</p>
            <button class="cta-btn" (click)="addSpot()">
              <mat-icon>add</mat-icon>
              Add Your First Spot
            </button>
          </div>
        } @else {
          <div class="listings-list">
            @for (spot of filteredSpots(); track spot.id) {
              <div class="listing-card" [class.inactive]="!spot.isActive">

                <!-- image -->
                <div class="listing-image">
                  <img [src]="spot.photos[0] || 'https://via.placeholder.com/400x200'" [alt]="spot.name" />
                  <div class="listing-badges">
                    @if (!spot.isActive) {
                      <span class="badge badge-inactive">
                        <mat-icon>pause</mat-icon>
                        Inactive
                      </span>
                    }
                    @if (spot.availableSlots === 0) {
                      <span class="badge badge-full">
                        <mat-icon>block</mat-icon>
                        Full
                      </span>
                    }
                  </div>
                </div>

                <!-- info -->
                <div class="listing-body">
                  <div class="listing-top">
                    <div class="listing-info">
                      <h3>{{ spot.name }}</h3>
                      <p class="address">
                        <mat-icon>location_on</mat-icon>
                        {{ spot.address }}
                      </p>
                    </div>
                    <div class="listing-price">
                      <span class="price-val">\${{ spot.pricePerHour }}</span>
                      <span class="price-unit">/hr</span>
                    </div>
                  </div>

                  <!-- stats row -->
                  <div class="listing-stats">
                    <div class="ls-item">
                      <mat-icon>local_parking</mat-icon>
                      <span>{{ spot.availableSlots }}/{{ spot.totalSlots }} slots</span>
                    </div>
                    <div class="ls-item">
                      <mat-icon>star</mat-icon>
                      <span>{{ spot.rating > 0 ? spot.rating.toFixed(1) : 'N/A' }}</span>
                    </div>
                    <div class="ls-item">
                      <mat-icon>schedule</mat-icon>
                      <span>{{ spot.operatingHours || '24/7' }}</span>
                    </div>
                  </div>

                  <!-- actions -->
                  <div class="listing-actions">
                    <button class="toggle-btn" [class.on]="spot.isActive" (click)="toggleActive(spot)">
                      <div class="toggle-track">
                        <div class="toggle-thumb"></div>
                      </div>
                      <span>{{ spot.isActive ? 'Active' : 'Inactive' }}</span>
                    </button>

                    <div class="action-btns">
                      <button class="act-btn edit" (click)="editSpot(spot)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button class="act-btn delete" (click)="deleteSpot(spot)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- FAB -->
      <!-- <button class="fab" (click)="addSpot()">
        <mat-icon>add</mat-icon>
      </button> -->

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .listings-page {
      min-height: 100vh;
      background: #f0f5f7;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- HERO HEADER ---------- */
    .hero-header {
      position: relative;
      overflow: hidden;
      padding-bottom: 24px;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(160deg, #0b2f4a 0%, #12587a 40%, #2f9bbf 100%);
    }

    /* animated bg */
    .anim-layer { position: absolute; inset: 0; overflow: hidden; }
    .float-shape {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(4px);
      animation: drift 16s linear infinite;
    }
    .float-shape mat-icon { font-size: 20px; width: 20px; height: 20px; color: rgba(255,255,255,0.2); }
    .fs-1 { width: 42px; height: 42px; top: 10%; left: 8%; animation-delay: 0s; }
    .fs-2 { width: 36px; height: 36px; top: 50%; right: 10%; border-radius: 50%; animation-delay: -5s; }
    .fs-3 { width: 38px; height: 38px; top: 70%; left: 20%; animation-delay: -8s; }

    @keyframes drift {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0.5; }
      25%  { transform: translateY(-15px) rotate(4deg); opacity: 0.75; }
      50%  { transform: translateY(-6px) rotate(-3deg); opacity: 0.45; }
      75%  { transform: translateY(-20px) rotate(3deg); opacity: 0.7; }
      100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      animation: orbPulse 5s ease-in-out infinite alternate;
    }
    .orb-1 { width: 160px; height: 160px; top: -40px; left: -30px; background: rgba(242,201,76,0.18); }
    .orb-2 { width: 130px; height: 130px; bottom: -30px; right: -20px; background: rgba(47,155,191,0.2); animation-delay: -2.5s; }
    @keyframes orbPulse { 0% { transform: scale(1); opacity: 0.35; } 100% { transform: scale(1.15); opacity: 0.6; } }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 20px 18px 0;
    }
    .hero-content h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      color: white;
    }
    .hero-sub {
      margin: 4px 0 16px;
      font-size: 13px;
      color: rgba(255,255,255,0.65);
    }

    .stats-row {
      display: flex;
      gap: 8px;
    }
    .stat-pill {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 8px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      backdrop-filter: blur(8px);
    }
    .stat-num { font-size: 20px; font-weight: 800; color: white; }
    .stat-label { font-size: 11px; color: rgba(255,255,255,0.6); }
    .sp-active { border-color: rgba(19,136,8,0.4); background: rgba(19,136,8,0.15); }
    .sp-inactive { border-color: rgba(220,38,38,0.3); background: rgba(220,38,38,0.1); }

    /* ---------- MAIN CONTENT ---------- */
    .main-content { padding: 0 18px 90px; }

    /* ---------- FILTER CHIPS ---------- */
    .filter-chips {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
      margin-top: 10px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1.5px solid #dfe7eb;
      background: white;
      font-size: 12.5px;
      font-weight: 600;
      color: #5b7385;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .chip mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .chip:hover { border-color: #0f7173; color: #0f7173; }
    .chip.active { background: #0f7173; border-color: #0f7173; color: white; }

    /* ---------- LISTING CARDS ---------- */
    .listings-list { display: flex; flex-direction: column; gap: 14px; }

    .listing-card {
      background: white;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(11,47,74,0.06);
      transition: transform 0.15s;
    }
    .listing-card:hover { transform: translateY(-1px); }
    .listing-card.inactive { opacity: 0.7; }

    .listing-image {
      position: relative;
      height: 160px;
      overflow: hidden;
    }
    .listing-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .listing-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      gap: 6px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      backdrop-filter: blur(6px);
    }
    .badge mat-icon { font-size: 12px; width: 12px; height: 12px; }
    .badge-inactive { background: rgba(220,38,38,0.85); color: white; }
    .badge-full { background: rgba(107,114,128,0.85); color: white; }

    .listing-body { padding: 14px 16px 16px; }

    .listing-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .listing-info h3 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .address {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0;
      font-size: 12.5px;
      color: #9aa8b1;
    }
    .address mat-icon { font-size: 14px; width: 14px; height: 14px; color: #FF9933; }

    .listing-price {
      display: flex;
      align-items: baseline;
      gap: 1px;
      flex-shrink: 0;
    }
    .price-val { font-size: 20px; font-weight: 800; color: #FF9933; }
    .price-unit { font-size: 12px; color: #9aa8b1; }

    .listing-stats {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }
    .ls-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #5b7385;
    }
    .ls-item mat-icon { font-size: 14px; width: 14px; height: 14px; color: #0f7173; }

    .listing-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f0f5f7;
    }

    /* custom toggle */
    .toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 12.5px;
      font-weight: 600;
      color: #9aa8b1;
      font-family: 'Poppins', 'Roboto', sans-serif;
      transition: color 0.2s;
    }
    .toggle-btn.on { color: #138808; }
    .toggle-track {
      width: 38px;
      height: 22px;
      border-radius: 11px;
      background: #dfe7eb;
      position: relative;
      transition: background 0.25s;
    }
    .toggle-btn.on .toggle-track { background: #138808; }
    .toggle-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      position: absolute;
      top: 2px;
      left: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      transition: transform 0.25s;
    }
    .toggle-btn.on .toggle-thumb { transform: translateX(16px); }

    .action-btns { display: flex; gap: 6px; }
    .act-btn {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .act-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .act-btn.edit {
      background: #eef6f8;
      color: #0f7173;
    }
    .act-btn.edit:hover { background: #d5eef2; }
    .act-btn.delete {
      background: #fef2f2;
      color: #dc2626;
    }
    .act-btn.delete:hover { background: #fde8e8; }

    /* ---------- FAB ---------- */
    .fab {
      position: fixed;
      bottom: 76px;
      right: 20px;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #FF9933, #e67300);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(255,153,51,0.35);
      z-index: 10;
      transition: all 0.2s;
    }
    .fab:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 10px 28px rgba(255,153,51,0.45);
    }
    .fab mat-icon { font-size: 26px; width: 26px; height: 26px; }

    /* ---------- EMPTY STATE ---------- */
    .empty-wrap { text-align: center; padding: 40px 20px; }
    .empty-illustration {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef6f8, #dfe7eb);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .empty-illustration mat-icon { font-size: 36px; width: 36px; height: 36px; color: #9aa8b1; }
    .empty-wrap h3 { margin: 0 0 6px; font-size: 17px; font-weight: 700; color: #0b2f4a; }
    .empty-wrap p { margin: 0 0 20px; font-size: 13px; color: #9aa8b1; }
    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 12px 24px;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #FF9933, #e67300);
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,153,51,0.3); }
    .cta-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class ListingsComponent implements OnInit {
  spots = signal<ParkingSpot[]>([]);
  filteredSpots = signal<ParkingSpot[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('all');
  activeCount = signal(0);
  inactiveCount = signal(0);

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSpots();
  }

  loadSpots(): void {
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        const all = this.dataService.getSpotsByOwner(user.uid);
        this.spots.set(all);
        this.activeCount.set(all.filter(s => s.isActive).length);
        this.inactiveCount.set(all.filter(s => !s.isActive).length);
        this.applyFilter();
        this.loading.set(false);
      }, 500);
    }
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.applyFilter();
  }

  applyFilter(): void {
    const f = this.activeFilter();
    const all = this.spots();
    if (f === 'active') {
      this.filteredSpots.set(all.filter(s => s.isActive));
    } else if (f === 'inactive') {
      this.filteredSpots.set(all.filter(s => !s.isActive));
    } else {
      this.filteredSpots.set(all);
    }
  }

  addSpot(): void {
    this.router.navigate(['/owner/add-spot']);
  }

  editSpot(spot: ParkingSpot): void {
    this.router.navigate(['/owner/edit-spot', spot.id]);
  }

  toggleActive(spot: ParkingSpot): void {
    this.dataService.updateSpot(spot.id, { isActive: !spot.isActive });
    this.loadSpots();
  }

  deleteSpot(spot: ParkingSpot): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Spot',
        message: `Are you sure you want to delete "${spot.name}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.deleteSpot(spot.id);
        this.loadSpots();
      }
    });
  }
}
