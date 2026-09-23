import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  title = input('E-Parking');
  showBack = input(false);
  showMenu = input(false);

  constructor(private router: Router, private authService: AuthService) {}

  onBackClick(): void {
    window.history.back();
  }

  onProfileClick(): void {
    const role = this.authService.userRole();
    this.router.navigate([`/${role}/profile`]);
  }

  onLogoutClick(): void {
    this.authService.logout();
  }
}
