import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.isManager()) {
      return true;
    }
    
    // Redirect to appropriate dashboard based on role
    if (this.authService.isAuthenticated()) {
      const dashboardRoute = this.authService.getUserDashboardRoute();
      this.router.navigate([dashboardRoute]);
    } else {
      this.router.navigate(['/login']);
    }
    
    return false;
  }
}