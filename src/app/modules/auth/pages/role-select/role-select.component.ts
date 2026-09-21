import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SpinnerComponent],
  template: `
    <div class="role-page">

      <!-- ===== ANIMATED BACKGROUND ===== -->
      <div class="bg-layer">
        <div class="gradient-bg"></div>

        <!-- floating shapes -->
        <div class="float-shape shape-1">
          <mat-icon>local_parking</mat-icon>
        </div>
        <div class="float-shape shape-2">
          <mat-icon>directions_car</mat-icon>
        </div>
        <div class="float-shape shape-3">
          <mat-icon>ev_station</mat-icon>
        </div>
        <div class="float-shape shape-4">
          <mat-icon>map</mat-icon>
        </div>
        <div class="float-shape shape-5">
          <mat-icon>schedule</mat-icon>
        </div>
        <div class="float-shape shape-6">
          <mat-icon>payments</mat-icon>
        </div>

        <!-- glowing orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <!-- grid lines -->
        <svg class="grid-lines" viewBox="0 0 400 800" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="400" y2="800" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <line x1="100" y1="0" x2="500" y2="800" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          <line x1="200" y1="0" x2="600" y2="800" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <line x1="-100" y1="0" x2="300" y2="800" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          <line x1="400" y1="0" x2="0" y2="800" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          <line x1="500" y1="0" x2="100" y2="800" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        </svg>
      </div>

      <!-- ===== BACK BUTTON ===== -->
      <button class="back-btn" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        <span>Back to Login</span>
      </button>

      @if (loading()) {
        <app-spinner [fullscreen]="true" message="Setting up your account..." />
      }

      <!-- ===== CARD ===== -->
      <div class="card">
        <div class="icon-badge">
          <mat-icon>how_to_reg</mat-icon>
        </div>

        <h1>How will you use<br/>E-Parking?</h1>
        <p class="subtitle">Choose your role to get started</p>

        <div class="role-options">
          <button class="role-card" (click)="selectRole('user')" [disabled]="loading()">
            <div class="role-icon user">
              <mat-icon>search</mat-icon>
            </div>
            <div class="role-info">
              <h3>Find Parking</h3>
              <p>Search and book parking spots near you</p>
            </div>
            <span class="arrow-badge">
              <mat-icon>chevron_right</mat-icon>
            </span>
          </button>

          <button class="role-card" (click)="selectRole('owner')" [disabled]="loading()">
            <div class="role-icon owner">
              <mat-icon>local_parking</mat-icon>
            </div>
            <div class="role-info">
              <h3>List My Parking</h3>
              <p>Manage your parking spots and earn money</p>
            </div>
            <span class="arrow-badge">
              <mat-icon>chevron_right</mat-icon>
            </span>
          </button>
        </div>

        <p class="hint">You can switch roles later from your profile</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .role-page {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: hidden;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- ANIMATED BACKGROUND ---------- */
    .bg-layer {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .gradient-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(160deg, #0b2f4a 0%, #12587a 40%, #2f9bbf 70%, #0f7173 100%);
    }

    /* floating shapes */
    .float-shape {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(4px);
      animation: floatUp linear infinite;
    }
    .float-shape mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: rgba(255,255,255,0.25);
    }

    .shape-1 {
      width: 56px; height: 56px;
      top: 10%;
      left: 8%;
      animation-duration: 14s;
      animation-delay: 0s;
    }
    .shape-2 {
      width: 48px; height: 48px;
      top: 30%;
      right: 10%;
      border-radius: 50%;
      animation-duration: 18s;
      animation-delay: -3s;
    }
    .shape-3 {
      width: 44px; height: 44px;
      top: 60%;
      left: 12%;
      animation-duration: 16s;
      animation-delay: -6s;
    }
    .shape-4 {
      width: 52px; height: 52px;
      top: 75%;
      right: 15%;
      animation-duration: 20s;
      animation-delay: -2s;
    }
    .shape-5 {
      width: 40px; height: 40px;
      top: 15%;
      right: 25%;
      border-radius: 50%;
      animation-duration: 15s;
      animation-delay: -8s;
    }
    .shape-6 {
      width: 46px; height: 46px;
      top: 85%;
      left: 30%;
      animation-duration: 17s;
      animation-delay: -4s;
    }

    @keyframes floatUp {
      0% {
        transform: translateY(0) rotate(0deg) scale(1);
        opacity: 0.6;
      }
      25% {
        transform: translateY(-30px) rotate(5deg) scale(1.05);
        opacity: 0.8;
      }
      50% {
        transform: translateY(-15px) rotate(-3deg) scale(0.95);
        opacity: 0.5;
      }
      75% {
        transform: translateY(-40px) rotate(4deg) scale(1.02);
        opacity: 0.7;
      }
      100% {
        transform: translateY(0) rotate(0deg) scale(1);
        opacity: 0.6;
      }
    }

    /* glowing orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      animation: pulse 6s ease-in-out infinite alternate;
    }
    .orb-1 {
      width: 300px; height: 300px;
      top: -80px; left: -80px;
      background: rgba(242, 201, 76, 0.2);
    }
    .orb-2 {
      width: 250px; height: 250px;
      bottom: -60px; right: -60px;
      background: rgba(47, 155, 191, 0.25);
      animation-delay: -3s;
    }
    .orb-3 {
      width: 200px; height: 200px;
      top: 40%;
      left: 50%;
      background: rgba(15, 113, 115, 0.15);
      animation-delay: -1.5s;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.4; }
      100% { transform: scale(1.15); opacity: 0.7; }
    }

    /* grid lines */
    .grid-lines {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      animation: gridMove 20s linear infinite;
    }
    @keyframes gridMove {
      0% { transform: translateY(0); }
      100% { transform: translateY(-800px); }
    }

    /* ---------- BACK BUTTON ---------- */
    .back-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 999px;
      border: 1.5px solid rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(8px);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }
    .back-btn:hover {
      background: rgba(255,255,255,0.2);
      border-color: rgba(255,255,255,0.4);
      transform: translateX(-2px);
    }
    .back-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ---------- CARD ---------- */
    .card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border-radius: 26px;
      padding: 36px 28px 28px;
      text-align: center;
      box-shadow: 0 -6px 0 rgba(242,201,76,0.9), 0 20px 40px rgba(11,47,74,0.35);
      animation: cardSlideUp 0.6s ease-out;
    }

    @keyframes cardSlideUp {
      0% {
        opacity: 0;
        transform: translateY(40px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .icon-badge {
      width: 64px; height: 64px;
      margin: 0 auto 18px;
      border-radius: 18px;
      background: #f2c94c;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 14px rgba(242,201,76,0.4);
      animation: iconBounce 0.8s ease-out 0.3s both;
    }
    .icon-badge mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #12233a;
    }

    @keyframes iconBounce {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    h1 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 800;
      color: #0b2f4a;
      line-height: 1.3;
    }
    .subtitle {
      margin: 0 0 28px;
      font-size: 13.5px;
      color: #5b7385;
    }

    .role-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .role-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border: 1.5px solid #dfe7eb;
      border-radius: 16px;
      background: #ffffff;
      cursor: pointer;
      text-align: left;
      transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    }
    .role-card:hover:not(:disabled) {
      border-color: #0f7173;
      background: #eef6f8;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15,113,115,0.12);
    }
    .role-card:disabled { opacity: 0.6; cursor: not-allowed; }

    .role-icon {
      flex: none;
      width: 44px; height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #f2c94c;
      transition: background 0.2s ease;
    }
    .role-card:hover .role-icon {
      background: #f2c94c;
    }
    .role-card:hover .role-icon mat-icon {
      color: #12233a;
    }
    .role-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #0f4c5c;
    }

    .role-info { flex: 1; }
    .role-info h3 {
      margin: 0 0 3px;
      font-size: 15px;
      font-weight: 700;
      color: #12233a;
    }
    .role-info p {
      margin: 0;
      font-size: 12.5px;
      color: #5b7385;
      line-height: 1.35;
    }

    .arrow-badge {
      flex: none;
      width: 30px; height: 30px;
      border-radius: 50%;
      background: #0f7173;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .role-card:hover .arrow-badge {
      transform: translateX(3px);
      background: #0b5f61;
    }
    .arrow-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: white;
    }

    .hint {
      margin-top: 22px;
      font-size: 12.5px;
      color: #9aa8b1;
    }
  `],
})
export class RoleSelectComponent {
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  goBack(): void {
    this.authService.logout();
    this.router.navigate(['/auth/landing']);
  }

  async selectRole(role: 'user' | 'owner'): Promise<void> {
    this.loading.set(true);
    await this.authService.selectRole(role);
    this.loading.set(false);

    if (role === 'user') {
      this.router.navigate(['/user/home']);
    } else {
      this.router.navigate(['/owner/dashboard']);
    }
  }
}
