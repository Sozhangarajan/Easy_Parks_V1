import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    SpinnerComponent,
    RouterLink,
  ],
  template: `
    <div class="forgot-page">
      @if (loading()) {
        <app-spinner [fullscreen]="true" message="Sending reset link..." />
      }

      <div class="content">
        <mat-icon class="main-icon">lock_reset</mat-icon>
        <h1>Forgot Password?</h1>
        <p>Enter your email and we'll send you a reset link</p>

        @if (!sent()) {
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email" />
              <mat-icon matPrefix>email</mat-icon>
              @if (forgotForm.get('email')?.hasError('required') && forgotForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (forgotForm.get('email')?.hasError('email') && forgotForm.get('email')?.touched) {
                <mat-error>Enter a valid email</mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-message">{{ errorMessage() }}</div>
            }

            <button mat-flat-button type="submit" class="full-width submit-btn" [disabled]="forgotForm.invalid || loading()">
              Send Reset Link
            </button>
          </form>
        } @else {
          <div class="success-message">
            <mat-icon>check_circle</mat-icon>
            <p>{{ successMessage() }}</p>
          </div>
        }

        <div class="links">
          <a routerLink="/auth/login">Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .content {
      text-align: center;
      max-width: 360px;
      width: 100%;
    }
    .main-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #FF9933;
      margin-bottom: 16px;
    }
    h1 { margin: 0 0 8px; font-size: 24px; }
    .content > p { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
    .full-width { width: 100%; }
    .error-message { color: #dc2626; font-size: 13px; margin-bottom: 12px; }
    .submit-btn {
      height: 48px;
      font-size: 16px;
      border-radius: 12px;
      margin-top: 8px;
      background: #FF9933;
      color: white;
    }
    .success-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px;
      color: #138808;
    }
    .success-message mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .success-message p { margin: 0; color: #6b7280; }
    .links {
      margin-top: 24px;
      text-align: center;
    }
    .links a {
      color: #138808;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
    }
  `],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = signal(false);
  sent = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    const result = await this.authService.forgotPassword(this.forgotForm.value.email);
    this.loading.set(false);

    if (result.success) {
      this.sent.set(true);
      this.successMessage.set(result.message);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
