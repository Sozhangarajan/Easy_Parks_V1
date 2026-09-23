import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { LandingComponent } from '../landing/landing.component';

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SpinnerComponent,LandingComponent],
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.css'],
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

  // Additional vehicle-related services shown below the main role choice.
  // Update these routes once the corresponding feature modules/pages exist.
  openService(service: 'fastag' | 'license' | 'insurance' | 'documents' | 'puc' | 'challan'): void {
    const routes: Record<typeof service, string> = {
      fastag: '/services/fastag',
      license: '/services/license-reminder',
      insurance: '/services/insurance-reminder',
      documents: '/services/vehicle-documents',
      puc: '/services/puc-reminder',
      challan: '/services/challan-check',
    };
    this.router.navigate([routes[service]]);
  }
}