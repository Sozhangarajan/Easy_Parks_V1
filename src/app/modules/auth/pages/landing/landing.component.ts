import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../core/services/auth.service';

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
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  identifier = '';
  password = '';
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  goToLogin(): void {
    this.authService.login('john@example.com', 'password123').then(() => {
      this.router.navigate(['/auth/role-select']);
      // this.router.navigate(['/user/home']);
    });
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