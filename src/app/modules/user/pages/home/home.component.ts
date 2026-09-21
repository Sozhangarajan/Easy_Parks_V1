import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ParkingSpot } from '../../../../core/models/parking-spot.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpotCardComponent } from '../../../../shared/components/spot-card/spot-card.component';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpotCardComponent,
    MapComponent,
    SpinnerComponent,
  ],
  template: `
    <div class="home-page">

      <!-- ===== HERO HEADER ===== -->
      <div class="hero-header">
        <div class="hero-bg">
          <div class="sky"></div>

          <!-- animated particles -->
          <div class="particle p1"></div>
          <div class="particle p2"></div>
          <div class="particle p3"></div>
          <div class="particle p4"></div>
          <div class="particle p5"></div>

          <svg class="skyline" viewBox="0 0 400 80" preserveAspectRatio="none">
            <rect x="0" y="30" width="30" height="50" fill="rgba(255,255,255,0.06)"/>
            <rect x="34" y="15" width="24" height="65" fill="rgba(255,255,255,0.08)"/>
            <rect x="62" y="35" width="26" height="45" fill="rgba(255,255,255,0.06)"/>
            <rect x="300" y="20" width="26" height="60" fill="rgba(255,255,255,0.06)"/>
            <rect x="330" y="10" width="22" height="70" fill="rgba(255,255,255,0.08)"/>
            <rect x="356" y="25" width="24" height="55" fill="rgba(255,255,255,0.07)"/>
          </svg>
        </div>

        <div class="hero-content">
          <div class="welcome-row">
            <div>
              <p class="greeting">{{ greeting() }}</p>
              <h1>Find Your Parking</h1>
            </div>
            <button class="avatar-btn" (click)="goToProfile()">
              <mat-icon>person</mat-icon>
            </button>
          </div>

          <!-- SEARCH BAR -->
          <div class="search-card" (click)="goToSearch()">
            <div class="search-icon-wrap">
              <mat-icon>search</mat-icon>
            </div>
            <div class="search-text">
              <span class="search-label">Where are you going?</span>
              <span class="search-hint">Search by location or spot name</span>
            </div>
            <div class="search-mic">
              <mat-icon>mic</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="main-content">

        <!-- QUICK ACTIONS -->
        <div class="section">
          <div class="quick-grid">
            <button class="quick-card" [class.active]="activeQuickFilter() === 'nearby'" (click)="setQuickFilter('nearby')">
              <div class="quick-icon qi-1">
                <mat-icon>near_me</mat-icon>
              </div>
              <span>Nearby</span>
            </button>
            <button class="quick-card" [class.active]="activeQuickFilter() === 'ev'" (click)="setQuickFilter('ev')">
              <div class="quick-icon qi-2">
                <mat-icon>ev_station</mat-icon>
              </div>
              <span>EV Charging</span>
            </button>
            <button class="quick-card" [class.active]="activeQuickFilter() === '247'" (click)="setQuickFilter('247')">
              <div class="quick-icon qi-3">
                <mat-icon>schedule</mat-icon>
              </div>
              <span>24/7 Open</span>
            </button>
            <button class="quick-card" [class.active]="activeQuickFilter() === 'cheap'" (click)="setQuickFilter('cheap')">
              <div class="quick-icon qi-4">
                <mat-icon>local_offer</mat-icon>
              </div>
              <span>Cheap</span>
            </button>
          </div>
        </div>

        <!-- VIEW TOGGLE + MAP -->
        <div class="section">
          <div class="section-header">
            <div class="header-left">
              @if (activeQuickFilter()) {
                <button class="back-pill" (click)="clearQuickFilter()">
                  <mat-icon>arrow_back</mat-icon>
                </button>
              }
              <h2>{{ getSectionTitle() }}</h2>
            </div>
            <div class="view-pills">
              <button class="pill" [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">
                <mat-icon>view_list</mat-icon>
              </button>
              <button class="pill" [class.active]="viewMode() === 'map'" (click)="viewMode.set('map')">
                <mat-icon>map</mat-icon>
              </button>
            </div>
          </div>

          @if (viewMode() === 'map') {
            <div class="map-wrapper">
              <app-map [spots]="displaySpots()" [height]="260" (markerClicked)="onSpotClick($event)" />
            </div>
          }
        </div>

        <!-- SPOT LIST -->
        <div class="section">
          <div class="section-header">
            <h2>{{ activeQuickFilter() ? getFilterSpotTitle() : 'Nearby Spots' }}</h2>
            <button class="see-all" (click)="goToSearch()">See All</button>
          </div>

          @if (loading()) {
            <app-spinner message="Finding spots..." />
          } @else if (displaySpots().length === 0) {
            <div class="empty-wrap">
              <div class="empty-icon-wrap">
                <mat-icon>{{ getEmptyIcon() }}</mat-icon>
              </div>
              <h3>{{ getEmptyTitle() }}</h3>
              <p>{{ getEmptyMessage() }}</p>
              @if (activeQuickFilter()) {
                <button class="clear-filter-btn" (click)="clearQuickFilter()">
                  <mat-icon>clear_all</mat-icon>
                  Show All Spots
                </button>
              }
            </div>
          } @else {
            <div class="spot-grid">
              @for (spot of displaySpots().slice(0, showAll() ? displaySpots().length : 3); track spot.id) {
                <app-spot-card [spot]="spot" (clicked)="onSpotClick($event)" />
              }
            </div>

            @if (!showAll() && displaySpots().length > 3) {
              <button class="show-more" (click)="showAll.set(true)">
                <mat-icon>expand_more</mat-icon>
                Show More ({{ displaySpots().length - 3 }} more)
              </button>
            }
          }
        </div>

        <!-- QUICK TIPS -->
        <div class="section">
          <div class="tips-card">
            <div class="tips-icon">
              <mat-icon>tips_and_updates</mat-icon>
            </div>
            <div class="tips-content">
              <h3>Parking Tip</h3>
              <p>Book in advance to guarantee your spot and save up to 20% on hourly rates.</p>
            </div>
          </div>
        </div>
      </div>

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .home-page {
      min-height: 100vh;
      background: #f0f5f7;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- HERO HEADER ---------- */
    .hero-header {
      position: relative;
      overflow: hidden;
      padding-bottom: 32px;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
    }
    .sky {
      position: absolute;
      inset: 0;
      background: linear-gradient(160deg, #0b2f4a 0%, #12587a 40%, #2f9bbf 100%);
    }

    /* animated particles */
    .particle {
      position: absolute;
      border-radius: 50%;
      background: rgba(242, 201, 76, 0.3);
      animation: drift 8s ease-in-out infinite;
    }
    .p1 { width: 8px; height: 8px; top: 15%; left: 10%; animation-delay: 0s; }
    .p2 { width: 6px; height: 6px; top: 25%; right: 15%; animation-delay: -2s; background: rgba(255,255,255,0.3); }
    .p3 { width: 10px; height: 10px; top: 40%; left: 30%; animation-delay: -4s; }
    .p4 { width: 5px; height: 5px; top: 10%; right: 35%; animation-delay: -1s; background: rgba(255,255,255,0.25); }
    .p5 { width: 7px; height: 7px; top: 50%; left: 60%; animation-delay: -3s; background: rgba(47,155,191,0.4); }

    @keyframes drift {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
      25% { transform: translate(10px, -15px) scale(1.2); opacity: 0.9; }
      50% { transform: translate(-5px, -8px) scale(0.9); opacity: 0.5; }
      75% { transform: translate(8px, -20px) scale(1.1); opacity: 0.8; }
    }

    .skyline {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 20px 18px 0;
    }

    .welcome-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    .greeting {
      margin: 0;
      font-size: 13px;
      color: rgba(255,255,255,0.7);
    }
    .welcome-row h1 {
      margin: 4px 0 0;
      font-size: 24px;
      font-weight: 800;
      color: white;
    }
    .avatar-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .avatar-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.5);
    }
    .avatar-btn mat-icon {
      color: white;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    /* ---------- SEARCH CARD ---------- */
    .search-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      border-radius: 18px;
      padding: 14px 16px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(11,47,74,0.2);
      transition: transform 0.15s, box-shadow 0.15s;
      margin-top: 10px;
    }
    .search-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(11,47,74,0.25);
    }
    .search-icon-wrap {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .search-icon-wrap mat-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .search-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .search-label {
      font-size: 14px;
      font-weight: 600;
      color: #0b2f4a;
    }
    .search-hint {
      font-size: 11.5px;
      color: #9aa8b1;
      margin-top: 2px;
    }
    .search-mic {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f0f5f7;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .search-mic mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #5b7385;
    }

    /* ---------- MAIN CONTENT ---------- */
    .main-content {
      padding: 0 18px 90px;
      margin-top: -8px;
    }

    .section {
      margin-bottom: 24px;
      margin-top: 20px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .section-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .back-pill {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      border: none;
      background: #eef6f8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .back-pill:hover { background: #d5eef2; }
    .back-pill mat-icon { font-size: 18px; width: 18px; height: 18px; color: #0f7173; }
    .see-all {
      font-size: 13px;
      font-weight: 600;
      color: #0f7173;
      background: none;
      border: none;
      cursor: pointer;
    }

    /* ---------- QUICK ACTIONS ---------- */
    .quick-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .quick-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 14px 4px;
      border-radius: 16px;
      border: 1.5px solid #e3e9ec;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quick-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(15,113,115,0.1);
      border-color: #0f7173;
    }
    .quick-card.active {
      border-color: #0f7173;
      background: #eef6f8;
    }
    .quick-card.active .quick-icon {
      box-shadow: 0 4px 12px rgba(15,113,115,0.25);
    }
    .quick-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .quick-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: white;
    }
    .qi-1 { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .qi-2 { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .qi-3 { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .qi-4 { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .quick-card span {
      font-size: 11px;
      font-weight: 600;
      color: #5b7385;
    }

    /* ---------- VIEW PILLS ---------- */
    .view-pills {
      display: flex;
      gap: 4px;
      background: #e3e9ec;
      border-radius: 10px;
      padding: 3px;
    }
    .pill {
      width: 34px;
      height: 30px;
      border-radius: 8px;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .pill mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9aa8b1;
    }
    .pill.active {
      background: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .pill.active mat-icon {
      color: #0f7173;
    }

    .map-wrapper {
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(11,47,74,0.1);
    }

    /* ---------- SPOT GRID ---------- */
    .spot-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .empty-wrap {
      padding: 20px 0;
      text-align: center;
    }
    .empty-icon-wrap {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef6f8, #dfe7eb);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px;
    }
    .empty-icon-wrap mat-icon { font-size: 32px; width: 32px; height: 32px; color: #9aa8b1; }
    .empty-wrap h3 { margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #0b2f4a; }
    .empty-wrap p { margin: 0 0 16px; font-size: 13px; color: #9aa8b1; }
    .clear-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .clear-filter-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,113,115,0.3); }
    .clear-filter-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .show-more {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      margin-top: 12px;
      padding: 12px;
      border-radius: 14px;
      border: 1.5px dashed #dfe7eb;
      background: transparent;
      font-size: 13px;
      font-weight: 600;
      color: #0f7173;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .show-more:hover {
      border-color: #0f7173;
      background: #eef6f8;
    }
    .show-more mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* ---------- TIPS CARD ---------- */
    .tips-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      border-radius: 18px;
      color: white;
    }
    .tips-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tips-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #f2c94c;
    }
    .tips-content h3 {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 700;
    }
    .tips-content p {
      margin: 0;
      font-size: 12px;
      opacity: 0.85;
      line-height: 1.4;
    }
  `],
})
export class HomeComponent implements OnInit {
  spots = signal<ParkingSpot[]>([]);
  displaySpots = signal<ParkingSpot[]>([]);
  loading = signal(true);
  viewMode = signal<'list' | 'map'>('list');
  showAll = signal(false);
  activeQuickFilter = signal<string | null>(null);

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSpots();
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  loadSpots(): void {
    this.loading.set(true);
    setTimeout(() => {
      const all = this.dataService.getActiveSpots();
      this.spots.set(all);
      this.displaySpots.set(all);
      this.loading.set(false);
    }, 500);
  }

  setQuickFilter(filter: string): void {
    if (this.activeQuickFilter() === filter) {
      this.clearQuickFilter();
      return;
    }
    this.activeQuickFilter.set(filter);
    this.showAll.set(false);
    this.applyQuickFilter(filter);
  }

  clearQuickFilter(): void {
    this.activeQuickFilter.set(null);
    this.showAll.set(false);
    this.displaySpots.set(this.spots());
  }

  applyQuickFilter(filter: string): void {
    let filtered = [...this.spots()];
    switch (filter) {
      case 'ev':
        filtered = filtered.filter(s => s.description?.toLowerCase().includes('ev'));
        break;
      case '247':
        filtered = filtered.filter(s => s.operatingHours === '24/7');
        break;
      case 'cheap':
        filtered = filtered.filter(s => s.pricePerHour <= 3);
        break;
      case 'nearby':
        filtered = filtered.filter(s => s.availableSlots > 0);
        break;
    }
    this.displaySpots.set(filtered);
  }

  getSectionTitle(): string {
    const titles: Record<string, string> = {
      nearby: 'Nearby Spots',
      ev: 'EV Charging Spots',
      '247': '24/7 Open Spots',
      cheap: 'Budget-Friendly Spots',
    };
    return this.activeQuickFilter() ? (titles[this.activeQuickFilter()!] || 'Filtered Spots') : 'Parking Spots';
  }

  getFilterSpotTitle(): string {
    const titles: Record<string, string> = {
      nearby: 'Available Nearby',
      ev: 'EV Charging Stations',
      '247': 'Open 24/7',
      cheap: 'Under $3/hr',
    };
    return titles[this.activeQuickFilter()!] || 'Filtered Spots';
  }

  getEmptyIcon(): string {
    const icons: Record<string, string> = {
      nearby: 'near_me',
      ev: 'ev_station',
      '247': 'schedule',
      cheap: 'local_offer',
    };
    return icons[this.activeQuickFilter()!] || 'local_parking';
  }

  getEmptyTitle(): string {
    const titles: Record<string, string> = {
      nearby: 'No nearby spots',
      ev: 'No EV charging spots',
      '247': 'No 24/7 spots',
      cheap: 'No cheap spots',
    };
    return titles[this.activeQuickFilter()!] || 'No spots found';
  }

  getEmptyMessage(): string {
    const msgs: Record<string, string> = {
      nearby: 'No available spots found nearby',
      ev: 'No EV charging stations available right now',
      '247': 'No 24/7 parking spots found',
      cheap: 'No spots under $3/hr available',
    };
    return msgs[this.activeQuickFilter()!] || 'No parking spots available';
  }

  onSpotClick(spot: ParkingSpot): void {
    this.router.navigate(['/user/parking', spot.id]);
  }

  goToSearch(): void {
    this.router.navigate(['/user/search']);
  }

  goToProfile(): void {
    this.router.navigate(['/user/profile']);
  }
}
