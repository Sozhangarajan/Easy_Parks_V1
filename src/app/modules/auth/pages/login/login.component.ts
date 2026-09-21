import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    SpinnerComponent,
    RouterLink,
  ],
  template: `
    <div class="login-page">
      <div class="header">
        <h1>Welcome Back</h1>
        <p>Log in to your account</p>
      </div>

      @if (loading()) {
        <app-spinner [fullscreen]="true" message="Logging in..." />
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email or Mobile</mat-label>
          <input matInput formControlName="emailOrMobile" placeholder="Enter email or mobile number" />
          <mat-icon matPrefix>person</mat-icon>
          @if (loginForm.get('emailOrMobile')?.hasError('required')) {
            <mat-error>Email or mobile is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" />
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (loginForm.get('password')?.hasError('required')) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <button mat-flat-button type="submit" class="full-width submit-btn" [disabled]="loginForm.invalid || loading()">
          Log In
        </button>
      </form>

      <div class="links">
        <a routerLink="/auth/forgot-password">Forgot Password?</a>
        <span>Don't have an account? <a routerLink="/auth/register">Register</a></span>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      padding: 48px 24px 24px;
      display: flex;
      flex-direction: column;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header h1 { margin: 0; font-size: 28px; color: #FF9933; }
    .header p { margin: 8px 0 0; color: #6b7280; }
    .full-width { width: 100%; }
    .error-message {
      color: #dc2626;
      font-size: 13px;
      margin-bottom: 12px;
      text-align: center;
    }
    .submit-btn {
      height: 48px;
      font-size: 16px;
      border-radius: 12px;
      margin-top: 8px;
      background: #FF9933;
      color: white;
    }
    .links {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .links a {
      color: #138808;
      text-decoration: none;
      font-weight: 500;
    }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailOrMobile: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    const { emailOrMobile, password } = this.loginForm.value;
    const result = await this.authService.login(emailOrMobile, password);
    this.loading.set(false);

    if (result.success) {
      const role = this.authService.userRole();
      if (role === 'owner') {
        this.router.navigate(['/owner/dashboard']);
      } else {
        this.router.navigate(['/auth/role-select']);
      }
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
