import { Component, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../../core/services/data.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Booking } from '../../../../core/models/booking.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BottomNavComponent,
    SpinnerComponent,
  ],
  template: `
    <div class="dashboard-page">

      <!-- ===== HERO HEADER ===== -->
      <div class="hero-header">
        <div class="hero-bg"></div>

        <!-- animated background elements -->
        <div class="anim-layer">
          <div class="float-shape fs-1"><mat-icon>local_parking</mat-icon></div>
          <div class="float-shape fs-2"><mat-icon>store</mat-icon></div>
          <div class="float-shape fs-3"><mat-icon>payments</mat-icon></div>
          <div class="float-shape fs-4"><mat-icon>book_online</mat-icon></div>
          <div class="float-shape fs-5"><mat-icon>trending_up</mat-icon></div>

          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>

          <svg class="grid-lines" viewBox="0 0 400 250" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="400" y2="250" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <line x1="100" y1="0" x2="500" y2="250" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
            <line x1="200" y1="0" x2="600" y2="250" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <line x1="300" y1="0" x2="700" y2="250" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          </svg>
        </div>

        <div class="hero-content">
          <div class="welcome-row">
            <div class="text-block">
              <p class="greeting">{{ greeting() }}</p>
              <h1>{{ user()?.name || 'Owner' }}</h1>
              <p class="role-tag">
                <mat-icon>store</mat-icon>
                Parking Owner
              </p>
            </div>
            <button class="avatar-btn" (click)="goToProfile()">
              <mat-icon>person</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="main-content">

        @if (loading()) {
          <app-spinner message="Loading dashboard..." />
        } @else {

          <!-- STATS ROW -->
          <div class="stats-row">
            <div class="stat-card sc-spots">
              <div class="stat-icon">
                <mat-icon>local_parking</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">{{ stats().totalSpots }}</span>
                <span class="stat-label">Total Spots</span>
              </div>
            </div>
            <div class="stat-card sc-active">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">{{ stats().activeSpots }}</span>
                <span class="stat-label">Active</span>
              </div>
            </div>
            <div class="stat-card sc-bookings">
              <div class="stat-icon">
                <mat-icon>book_online</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">{{ stats().totalBookings }}</span>
                <span class="stat-label">Bookings</span>
              </div>
            </div>
            <div class="stat-card sc-earnings">
              <div class="stat-icon">
                <mat-icon>payments</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-num">\${{ stats().totalEarnings }}</span>
                <span class="stat-label">Earnings</span>
              </div>
            </div>
          </div>

          <!-- OCCUPANCY CARD -->
          <div class="card">
            <div class="card-header">
              <mat-icon>pie_chart</mat-icon>
              <span>Occupancy Overview</span>
            </div>
            <div class="occupancy-visual">
              <div class="ring-wrap">
                <svg class="ring-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#eef6f8" stroke-width="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#ringGrad)" stroke-width="8"
                    stroke-linecap="round"
                    [attr.stroke-dasharray]="ringDash()"
                    stroke-dashoffset="0"
                    transform="rotate(-90 50 50)" />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#0f7173" />
                      <stop offset="100%" stop-color="#2f9bbf" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="ring-center">
                  <span class="ring-pct">{{ stats().occupancyRate }}%</span>
                  <span class="ring-label">Occupied</span>
                </div>
              </div>
              <div class="occupancy-details">
                <div class="od-item">
                  <div class="od-dot od-free"></div>
                  <span>Free Slots</span>
                  <strong>{{ totalSlots() - occupiedSlots() }}</strong>
                </div>
                <div class="od-item">
                  <div class="od-dot od-occupied"></div>
                  <span>Occupied</span>
                  <strong>{{ occupiedSlots() }}</strong>
                </div>
                <div class="od-item">
                  <div class="od-dot od-total"></div>
                  <span>Total</span>
                  <strong>{{ totalSlots() }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- QUICK ACTIONS -->
          <div class="card">
            <div class="card-header">
              <mat-icon>bolt</mat-icon>
              <span>Quick Actions</span>
            </div>
            <div class="actions-grid">
              <button class="action-card" (click)="addSpot()">
                <div class="ac-icon ac-add">
                  <mat-icon>add_circle</mat-icon>
                </div>
                <span>Add Spot</span>
              </button>
              <button class="action-card" (click)="viewListings()">
                <div class="ac-icon ac-list">
                  <mat-icon>view_list</mat-icon>
                </div>
                <span>Listings</span>
              </button>
              <button class="action-card" (click)="viewBookings()">
                <div class="ac-icon ac-book">
                  <mat-icon>receipt_long</mat-icon>
                </div>
                <span>Bookings</span>
              </button>
              <button class="action-card" (click)="goToProfile()">
                <div class="ac-icon ac-profile">
                  <mat-icon>person</mat-icon>
                </div>
                <span>Profile</span>
              </button>
            </div>
          </div>

          <!-- RECENT BOOKINGS -->
          <div class="card">
            <div class="card-header">
              <mat-icon>history</mat-icon>
              <span>Recent Bookings</span>
              @if (recentBookings().length > 0) {
                <span class="badge">{{ recentBookings().length }}</span>
              }
            </div>
            @if (recentBookings().length === 0) {
              <div class="empty-mini">
                <mat-icon>event_busy</mat-icon>
                <p>No bookings yet</p>
              </div>
            } @else {
              <div class="bookings-list">
                @for (b of recentBookings(); track b.id) {
                  <div class="booking-row">
                    <div class="br-icon">
                      <mat-icon>local_parking</mat-icon>
                    </div>
                    <div class="br-info">
                      <span class="br-name">{{ b.spotName }}</span>
                      <span class="br-meta">{{ b.userName }} &middot; {{ b.totalHours }}h</span>
                    </div>
                    <div class="br-right">
                      <span class="br-cost">\${{ b.totalCost }}</span>
                      <span class="br-status" [class]="'bs-' + b.status">{{ b.status }}</span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- PERFORMANCE TIP -->
          <div class="tip-card">
            <div class="tip-icon">
              <mat-icon>tips_and_updates</mat-icon>
            </div>
            <div class="tip-content">
              <h3>Boost Your Earnings</h3>
              <p>Add photos and detailed descriptions to attract more bookings.</p>
            </div>
          </div>

        }
      </div>

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .dashboard-page {
      min-height: 100vh;
      background: #f0f5f7;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- HERO HEADER ---------- */
    .hero-header {
      position: relative;
      overflow: hidden;
      padding-bottom: 28px;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(160deg, #0b2f4a 0%, #12587a 40%, #2f9bbf 100%);
    }

    /* animated background layer */
    .anim-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    /* floating shapes */
    .float-shape {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(4px);
      animation: floatDrift linear infinite;
    }
    .float-shape mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: rgba(255,255,255,0.2);
    }

    .fs-1 { width: 48px; height: 48px; top: 8%; left: 6%; animation-duration: 14s; animation-delay: 0s; }
    .fs-2 { width: 42px; height: 42px; top: 20%; right: 8%; border-radius: 50%; animation-duration: 18s; animation-delay: -3s; }
    .fs-3 { width: 40px; height: 40px; top: 55%; left: 10%; animation-duration: 16s; animation-delay: -6s; }
    .fs-4 { width: 44px; height: 44px; top: 65%; right: 12%; animation-duration: 20s; animation-delay: -2s; }
    .fs-5 { width: 36px; height: 36px; top: 12%; right: 28%; border-radius: 50%; animation-duration: 15s; animation-delay: -8s; }

    @keyframes floatDrift {
      0%   { transform: translateY(0) rotate(0deg) scale(1);    opacity: 0.5; }
      25%  { transform: translateY(-18px) rotate(4deg) scale(1.06);  opacity: 0.75; }
      50%  { transform: translateY(-8px) rotate(-3deg) scale(0.94);  opacity: 0.45; }
      75%  { transform: translateY(-22px) rotate(3deg) scale(1.03);  opacity: 0.7; }
      100% { transform: translateY(0) rotate(0deg) scale(1);    opacity: 0.5; }
    }

    /* glowing orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      animation: orbPulse 5s ease-in-out infinite alternate;
    }
    .orb-1 {
      width: 180px; height: 180px;
      top: -50px; left: -40px;
      background: rgba(242, 201, 76, 0.18);
    }
    .orb-2 {
      width: 150px; height: 150px;
      bottom: -40px; right: -30px;
      background: rgba(47, 155, 191, 0.2);
      animation-delay: -2.5s;
    }

    @keyframes orbPulse {
      0%   { transform: scale(1);   opacity: 0.35; }
      100% { transform: scale(1.15); opacity: 0.6; }
    }

    /* grid lines */
    .grid-lines {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      animation: gridScroll 18s linear infinite;
    }
    @keyframes gridScroll {
      0%   { transform: translateY(0); }
      100% { transform: translateY(-250px); }
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
    }
    .text-block {
      animation: fadeSlideIn 0.6s ease-out both;
    }
    @keyframes fadeSlideIn {
      0%   { opacity: 0; transform: translateY(14px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .greeting {
      margin: 0;
      font-size: 13px;
      color: rgba(255,255,255,0.65);
    }
    .welcome-row h1 {
      margin: 4px 0 0;
      font-size: 24px;
      font-weight: 800;
      color: white;
    }
    .role-tag {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin: 6px 0 0;
      padding: 3px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
    }
    .role-tag mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
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
      animation: fadeSlideIn 0.6s ease-out 0.15s both;
    }
    .avatar-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.5);
    }
    .avatar-btn mat-icon { color: white; font-size: 22px; width: 22px; height: 22px; }

    /* ---------- MAIN CONTENT ---------- */
    .main-content {
      padding: 0 18px 90px;
    }

    /* ---------- STATS ROW ---------- */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 14px;
      margin-top: 10px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 10px rgba(11,47,74,0.06);
    }
    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon { font-size: 22px; width: 22px; height: 22px; color: white; }
    .sc-spots .stat-icon { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .sc-active .stat-icon { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .sc-bookings .stat-icon { background: linear-gradient(135deg, #0f7173, #2f9bbf); }
    .sc-earnings .stat-icon { background: linear-gradient(135deg, #0f7173, #2f9bbf); }

    .stat-info { display: flex; flex-direction: column; }
    .stat-num { font-size: 20px; font-weight: 800; color: #0b2f4a; }
    .stat-label { font-size: 12px; color: #9aa8b1; }

    /* ---------- CARDS ---------- */
    .card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 14px;
      box-shadow: 0 2px 12px rgba(11,47,74,0.06);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 15px;
      font-weight: 700;
      color: #0b2f4a;
    }
    .card-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #0f7173;
    }
    .badge {
      margin-left: auto;
      background: #FF9933;
      color: white;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 999px;
      font-weight: 700;
    }

    /* ---------- OCCUPANCY ---------- */
    .occupancy-visual {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .ring-wrap {
      position: relative;
      width: 110px;
      height: 110px;
      flex-shrink: 0;
    }
    .ring-svg { width: 100%; height: 100%; }
    .ring-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .ring-pct { font-size: 22px; font-weight: 800; color: #0b2f4a; }
    .ring-label { font-size: 10px; color: #9aa8b1; }

    .occupancy-details { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .od-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #5b7385;
    }
    .od-item strong { margin-left: auto; color: #0b2f4a; }
    .od-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .od-free { background: #138808; }
    .od-occupied { background: #FF9933; }
    .od-total { background: #0f7173; }

    /* ---------- QUICK ACTIONS ---------- */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .action-card {
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
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(15,113,115,0.1);
      border-color: #0f7173;
    }
    .ac-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ac-icon mat-icon { font-size: 20px; width: 20px; height: 20px; color: white; }
    .ac-add { background: linear-gradient(135deg, #0b2f4a, #12587a); }
    .ac-list { background: linear-gradient(135deg, #0b2f4a, #12587a); }
    .ac-book { background: linear-gradient(135deg, #0b2f4a, #12587a); }
    .ac-profile { background: linear-gradient(135deg, #0b2f4a, #12587a); }
    .action-card span { font-size: 11px; font-weight: 600; color: #5b7385; }

    /* ---------- RECENT BOOKINGS ---------- */
    .empty-mini {
      text-align: center;
      padding: 20px 0;
    }
    .empty-mini mat-icon { font-size: 36px; width: 36px; height: 36px; color: #dfe7eb; }
    .empty-mini p { margin: 6px 0 0; font-size: 13px; color: #9aa8b1; }

    .bookings-list { display: flex; flex-direction: column; gap: 10px; }
    .booking-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f7f9fb;
      border-radius: 14px;
    }
    .br-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .br-icon mat-icon { font-size: 18px; width: 18px; height: 18px; color: white; }
    .br-info { flex: 1; display: flex; flex-direction: column; }
    .br-name { font-size: 13px; font-weight: 700; color: #0b2f4a; }
    .br-meta { font-size: 11px; color: #9aa8b1; }
    .br-right { display: flex; flex-direction: column; align-items: flex-end; }
    .br-cost { font-size: 14px; font-weight: 700; color: #FF9933; }
    .br-status {
      font-size: 10px;
      font-weight: 700;
      text-transform: capitalize;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .bs-pending { background: #fff7ed; color: #FF9933; }
    .bs-confirmed { background: #dcfce7; color: #138808; }
    .bs-active { background: #e0f2fe; color: #0284c7; }
    .bs-completed { background: #f3f4f6; color: #6b7280; }
    .bs-cancelled { background: #fee2e2; color: #dc2626; }

    /* ---------- TIP CARD ---------- */
    .tip-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: linear-gradient(135deg, #0f7173, #2f9bbf);
      border-radius: 18px;
      color: white;
    }
    .tip-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tip-icon mat-icon { font-size: 22px; width: 22px; height: 22px; color: #f2c94c; }
    .tip-content h3 { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
    .tip-content p { margin: 0; font-size: 12px; opacity: 0.85; line-height: 1.4; }
  `],
})
export class OwnerDashboardComponent implements OnInit {
  stats = signal({
    totalSpots: 0,
    activeSpots: 0,
    totalBookings: 0,
    totalEarnings: 0,
    occupancyRate: 0,
  });
  loading = signal(true);
  recentBookings = signal<Booking[]>([]);
  totalSlots = signal(0);
  occupiedSlots = signal(0);
  private authService = inject(AuthService);
  user = this.authService.user;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  ringDash(): string {
    const circumference = 2 * Math.PI * 40;
    const filled = (this.stats().occupancyRate / 100) * circumference;
    return `${filled} ${circumference}`;
  }

  loadStats(): void {
    const user = this.authService.user();
    if (user) {
      setTimeout(() => {
        const s = this.dataService.getOwnerStats(user.uid);
        this.stats.set(s);

        const spots = this.dataService.getSpotsByOwner(user.uid);
        const ts = spots.reduce((a, sp) => a + sp.totalSlots, 0);
        const os = spots.reduce((a, sp) => a + (sp.totalSlots - sp.availableSlots), 0);
        this.totalSlots.set(ts);
        this.occupiedSlots.set(os);

        const bookings = this.dataService.getBookingsByOwner(user.uid);
        this.recentBookings.set(bookings.slice(0, 5));

        this.loading.set(false);
      }, 500);
    }
  }

  addSpot(): void {
    this.router.navigate(['/owner/add-spot']);
  }

  viewListings(): void {
    this.router.navigate(['/owner/listings']);
  }

  viewBookings(): void {
    this.router.navigate(['/owner/bookings-requests']);
  }

  goToProfile(): void {
    this.router.navigate(['/owner/profile']);
  }
}
