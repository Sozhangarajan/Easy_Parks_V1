import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="landing-page">

      <!-- ===== HERO ===== -->
      <div class="hero">
        <div class="hero-bg">
          <div class="sky"></div>
          <svg class="skyline" viewBox="0 0 400 120" preserveAspectRatio="none">
            <rect x="0" y="60" width="30" height="60" fill="rgba(255,255,255,0.08)"/>
            <rect x="34" y="40" width="24" height="80" fill="rgba(255,255,255,0.1)"/>
            <rect x="62" y="70" width="26" height="50" fill="rgba(255,255,255,0.08)"/>
            <rect x="94" y="30" width="22" height="90" fill="rgba(255,255,255,0.12)"/>
            <rect x="300" y="50" width="26" height="70" fill="rgba(255,255,255,0.08)"/>
            <rect x="330" y="25" width="22" height="95" fill="rgba(255,255,255,0.12)"/>
            <rect x="356" y="55" width="24" height="65" fill="rgba(255,255,255,0.1)"/>
          </svg>

          <svg class="road" viewBox="0 0 400 60" preserveAspectRatio="none">
            <rect x="0" y="0" width="400" height="60" fill="rgba(0,0,0,0.12)"/>
            <rect x="0" y="26" width="60" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>
            <rect x="90" y="26" width="60" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>
            <rect x="180" y="26" width="60" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>
          </svg>

          <svg class="car" viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="24" width="130" height="26" rx="12" fill="#f4f6f8"/>
            <path d="M24 24 L40 4 H108 L124 24 Z" fill="#f4f6f8"/>
            <path d="M46 22 L56 8 H92 L102 22 Z" fill="#0f4c5c"/>
            <circle cx="38" cy="52" r="11" fill="#12233a"/>
            <circle cx="38" cy="52" r="4" fill="#cfd8e3"/>
            <circle cx="112" cy="52" r="11" fill="#12233a"/>
            <circle cx="112" cy="52" r="4" fill="#cfd8e3"/>
            <rect x="132" y="30" width="6" height="8" rx="2" fill="#e94b3c"/>
          </svg>

          <svg class="p-sign" viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="30" width="8" height="60" fill="#12233a"/>
            <rect x="2" y="0" width="56" height="46" rx="8" fill="#0f4c5c" stroke="#f2c94c" stroke-width="3"/>
            <text x="30" y="24" font-size="24" font-weight="800" fill="white" text-anchor="middle">P</text>
            <path d="M14 32 h32 a4 4 0 0 1 4 4 v0 a4 4 0 0 1 -4 4 h-32 a4 4 0 0 1 -4 -4 v0 a4 4 0 0 1 4 -4 Z" fill="white" opacity="0.9"/>
          </svg>
        </div>

        <div class="hero-content">
          <div class="brand-row">
            <div class="logo-mark">
              <mat-icon>directions_car</mat-icon>
            </div>
            <div class="brand-text">
              <h1>E-Parking</h1>
              <span class="brand-sub">Smart Parking&nbsp; · &nbsp;Easy Living</span>
            </div>
          </div>

          <p class="hero-tagline">Find, Book and Pay for Parking — All in One Place!</p>

          <div class="hero-features">
            <div class="hf-item">
              <div class="hf-icon"><mat-icon>search</mat-icon></div>
              <span>Find<br/>Parking</span>
            </div>
            <div class="hf-divider"></div>
            <div class="hf-item">
              <div class="hf-icon"><mat-icon>event_available</mat-icon></div>
              <span>Book<br/>Your Spot</span>
            </div>
            <div class="hf-divider"></div>
            <div class="hf-item">
              <div class="hf-icon"><mat-icon>credit_card</mat-icon></div>
              <span>Pay<br/>Securely</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== LOGIN CARD ===== -->
      <div class="login-card">
        <h2>Welcome Back!</h2>
        <p class="card-sub">Login to your E-Parking account</p>

        <div class="input-group">
          <mat-icon class="input-icon">person</mat-icon>
          <input
            class="plain-input"
            type="text"
            placeholder="Mobile Number / Email"
            [(ngModel)]="identifier"
            name="identifier"
          />
        </div>

        <div class="input-group">
          <mat-icon class="input-icon">lock</mat-icon>
          <input
            class="plain-input"
            [type]="showPassword ? 'text' : 'password'"
            placeholder="Password"
            [(ngModel)]="password"
            name="password"
          />
          <mat-icon class="input-icon toggle" (click)="showPassword = !showPassword">
            {{ showPassword ? 'visibility' : 'visibility_off' }}
          </mat-icon>
        </div>

        <div class="forgot-row">
          <a class="forgot-link" (click)="forgotPassword()">Forgot Password?</a>
        </div>

        <button mat-flat-button class="login-btn" (click)="goToLogin()">
          <span>Login</span>
          <mat-icon>arrow_forward</mat-icon>
        </button>

        <div class="divider-row">
          <span class="line"></span>
          <span class="or">or</span>
          <span class="line"></span>
        </div>

        <div class="social-row">
          <button class="social-btn google" (click)="continueWithGoogle()" aria-label="Continue with Google">
            <svg viewBox="0 0 48 48" width="22" height="22">
              <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.5 35.5 26.9 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.5 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.1 36.9 44 31.1 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
          </button>
          <button class="social-btn facebook" (click)="continueWithFacebook()" aria-label="Continue with Facebook">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
            </svg>
          </button>
          <button class="social-btn instagram" (click)="continueWithInstagram()" aria-label="Continue with Instagram">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <defs>
                <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
                  <stop offset="0%" stop-color="#fdf497"/>
                  <stop offset="15%" stop-color="#fdf497"/>
                  <stop offset="45%" stop-color="#fd5949"/>
                  <stop offset="60%" stop-color="#d6249f"/>
                  <stop offset="90%" stop-color="#285AEB"/>
                </radialGradient>
              </defs>
              <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#igGrad)"/>
              <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="white" stroke-width="1.6"/>
              <circle cx="12" cy="12" r="3.2" fill="none" stroke="white" stroke-width="1.6"/>
              <circle cx="16.2" cy="7.8" r="1" fill="white"/>
            </svg>
          </button>
        </div>

        <p class="signup-row">
          Don't have an account?
          <a class="signup-link" (click)="goToRegister()">Sign Up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .landing-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #eef6f8;
      font-family: 'Poppins', 'Roboto', sans-serif;
    }

    /* ---------- HERO ---------- */
    .hero {
      position: relative;
      height: 46vh;
      min-height: 340px;
      overflow: hidden;
    }
    .hero-bg { position: absolute; inset: 0; }
    .sky {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, #0b2f4a 0%, #12587a 45%, #2f9bbf 100%);
    }
    .skyline {
      position: absolute;
      bottom: 60px;
      left: 0;
      width: 100%;
      height: 110px;
    }
    .road {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
    }
    .car {
      position: absolute;
      bottom: 60px;
      right: 8%;
      width: 130px;
      height: auto;
      filter: drop-shadow(0 8px 10px rgba(0,0,0,0.3));
    }
    .p-sign {
      position: absolute;
      bottom: 66px;
      right: 30%;
      width: 44px;
      height: auto;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 28px 22px 0;
      color: white;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-mark {
      width: 50px; height: 50px;
      border-radius: 16px;
      background: #f2c94c;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 14px rgba(0,0,0,0.25);
      flex: none;
    }
    .logo-mark mat-icon { color: #12233a; font-size: 26px; width: 26px; height: 26px; }
    .brand-text h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.3px;
    }
    .brand-sub { font-size: 12px; opacity: 0.85; }

    .hero-tagline {
      margin: 18px 0 0;
      font-size: 15px;
      max-width: 230px;
      line-height: 1.35;
      opacity: 0.95;
    }

    .hero-features {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 22px;
    }
    .hf-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.3;
      text-align: center;
    }
    .hf-icon {
      width: 42px; height: 42px;
      border-radius: 50%;
      border: 2px solid #f2c94c;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hf-icon mat-icon { color: #f2c94c; font-size: 20px; width: 20px; height: 20px; }
    .hf-divider {
      width: 1px; height: 34px;
      background: rgba(255,255,255,0.3);
    }

    /* ---------- LOGIN CARD ---------- */
    .login-card {
      position: relative;
      z-index: 3;
      margin: -32px 14px 0;
      background: white;
      border-radius: 26px;
      padding: 28px 22px 28px;
      box-shadow: 0 -6px 0 rgba(242,201,76,0.9), 0 16px 32px rgba(15,76,92,0.18);
    }
    .login-card h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: #0b2f4a;
    }
    .card-sub {
      margin: 6px 0 20px;
      font-size: 13px;
      color: #5b7385;
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1.5px solid #dfe7eb;
      border-radius: 14px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .input-icon { color: #0f4c5c; font-size: 20px; width: 20px; height: 20px; }
    .input-icon.toggle { cursor: pointer; color: #9aa8b1; margin-left: auto; }
    .plain-input {
      border: none;
      outline: none;
      flex: 1;
      font-size: 14px;
      color: #12233a;
      background: transparent;
    }
    .plain-input::placeholder { color: #9aa8b1; }

    .forgot-row { text-align: right; margin-bottom: 16px; }
    .forgot-link {
      font-size: 12.5px;
      font-weight: 600;
      color: #0f7173;
      cursor: pointer;
    }

    .login-btn {
      width: 100%;
      height: 50px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 600;
      background: #0f7173;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 8px 18px rgba(15,113,115,0.3);
    }

    .divider-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 18px 0;
    }
    .divider-row .line { flex: 1; height: 1px; background: #e3e9ec; }
    .divider-row .or { font-size: 12px; color: #9aa8b1; }

    .social-row {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    .social-btn {
      width: 48px; height: 48px;
      border-radius: 50%;
      border: 1.5px solid #dfe7eb;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .social-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(15,76,92,0.15);
    }
    .social-btn svg {
      display: block;
    }

    .signup-row {
      text-align: center;
      margin: 18px 0 4px;
      font-size: 13px;
      color: #5b7385;
    }
    .signup-link {
      color: #0f7173;
      font-weight: 700;
      cursor: pointer;
      margin-left: 4px;
    }
  `],
})
export class LandingComponent {
  identifier = '';
  password = '';
  showPassword = false;

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  forgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  continueWithGoogle(): void {
    // hook up Google OAuth flow here
  }

  continueWithFacebook(): void {
    // hook up Facebook OAuth flow here
  }

  continueWithInstagram(): void {
    // hook up Instagram OAuth flow here
  }
}