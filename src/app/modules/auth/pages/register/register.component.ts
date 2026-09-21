import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-register',
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
    <div class="register-page">
      <div class="header">
        <h1>Create Account</h1>
        <p>Join E-Parking today</p>
      </div>

      @if (loading()) {
        <app-spinner [fullscreen]="true" message="Creating account..." />
      }

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter your full name" />
          <mat-icon matPrefix>person</mat-icon>
          @if (registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Enter your email" />
          <mat-icon matPrefix>email</mat-icon>
          @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mobile Number</mat-label>
          <input matInput formControlName="mobile" placeholder="Enter mobile number" />
          <mat-icon matPrefix>phone</mat-icon>
          @if (registerForm.get('mobile')?.hasError('required') && registerForm.get('mobile')?.touched) {
            <mat-error>Mobile number is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" />
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
          @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
            <mat-error>Password must be at least 6 characters</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword() ? 'password' : 'text'" />
          <mat-icon matPrefix>lock_outline</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword.set(!hideConfirmPassword())">
            <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
            <mat-error>Please confirm your password</mat-error>
          }
          @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <button mat-flat-button type="submit" class="full-width submit-btn" [disabled]="registerForm.invalid || loading()">
          Create Account
        </button>
      </form>

      <div class="links">
        <span>Already have an account? <a routerLink="/auth/login">Log In</a></span>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      padding: 48px 24px 24px;
      display: flex;
      flex-direction: column;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
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
      text-align: center;
      font-size: 14px;
    }
    .links a {
      color: #138808;
      text-decoration: none;
      font-weight: 500;
    }
  `],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    const { name, email, mobile, password } = this.registerForm.value;
    const result = await this.authService.register({ name, email, mobile, password });
    this.loading.set(false);

    if (result.success) {
      this.router.navigate(['/auth/role-select']);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
