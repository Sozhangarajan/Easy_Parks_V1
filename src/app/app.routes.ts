import { Routes } from '@angular/router';
import { authGuard, roleGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/landing',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'landing',
        loadComponent: () =>
          import('./modules/auth/pages/landing/landing.component').then((m) => m.LandingComponent),
        canActivate: [noAuthGuard],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./modules/auth/pages/login/login.component').then((m) => m.LoginComponent),
        canActivate: [noAuthGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./modules/auth/pages/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [noAuthGuard],
      },
      {
        path: 'role-select',
        loadComponent: () =>
          import('./modules/auth/pages/role-select/role-select.component').then((m) => m.RoleSelectComponent),
        canActivate: [authGuard],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./modules/auth/pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
      },
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'user',
    canActivate: [roleGuard],
    data: { role: 'user' },
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./modules/user/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'parking/:id',
        loadComponent: () =>
          import('./modules/user/pages/parking-detail/parking-detail.component').then((m) => m.ParkingDetailComponent),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./modules/user/pages/search/search.component').then((m) => m.SearchComponent),
      },
      {
        path: 'booking-confirm/:id',
        loadComponent: () =>
          import('./modules/user/pages/booking-confirm/booking-confirm.component').then((m) => m.BookingConfirmComponent),
      },
      {
        path: 'my-bookings',
        loadComponent: () =>
          import('./modules/user/pages/my-bookings/my-bookings.component').then((m) => m.MyBookingsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./modules/user/pages/profile/profile.component').then((m) => m.UserProfileComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'owner',
    canActivate: [roleGuard],
    data: { role: 'owner' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/owner/pages/dashboard/dashboard.component').then((m) => m.OwnerDashboardComponent),
      },
      {
        path: 'add-spot',
        loadComponent: () =>
          import('./modules/owner/pages/add-edit-spot/add-edit-spot.component').then((m) => m.AddEditSpotComponent),
      },
      {
        path: 'edit-spot/:id',
        loadComponent: () =>
          import('./modules/owner/pages/add-edit-spot/add-edit-spot.component').then((m) => m.AddEditSpotComponent),
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./modules/owner/pages/listings/listings.component').then((m) => m.ListingsComponent),
      },
      {
        path: 'bookings-requests',
        loadComponent: () =>
          import('./modules/owner/pages/bookings-requests/bookings-requests.component').then((m) => m.BookingsRequestsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./modules/owner/pages/profile/profile.component').then((m) => m.OwnerProfileComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/landing',
  },
];
