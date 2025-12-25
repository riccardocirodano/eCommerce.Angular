import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { AdminService, DashboardStats, User } from '../../services/admin.service';
import { AuthenticationResponse } from '../../models/auth.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  currentUser: AuthenticationResponse | null = null;
  dashboardStats: DashboardStats | null = null;
  recentUsers: User[] = [];
  isLoading = true;
  viewReady = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/user-dashboard']);
      return;
    }
    // IMPORTANT: do NOT call loadDashboardData() here
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewReady = true;
      this.loadDashboardData();
    }, 0);
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.adminService.getDashboardStats().subscribe({
      next: (response: any) => {
        const stats = response?.stats ?? response?.Stats;

        setTimeout(() => {
          this.dashboardStats = stats ?? null;
          this.recentUsers = stats?.recentUsers ?? stats?.RecentUsers ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        setTimeout(() => {
          this.snackBar.open('Failed to load dashboard data', 'Close', { duration: 3000 });
          this.isLoading = false;
        }, 0);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  navigateToActivityLogs(): void {
    this.router.navigate(['/admin/activity-logs']);
  }
}