import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AuthenticationResponse } from '../../models/auth.models';
import { environment } from '../../../environments/environment';

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
    MatTableModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: AuthenticationResponse | null = null;
  dashboardStats: any = null;
  users: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/user-dashboard']);
      return;
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.http.get(`${environment.apiUrl}/admin/dashboard`).subscribe({
      next: (data: any) => {
        this.dashboardStats = data.stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.http.get(`${environment.apiUrl}/admin/users`).subscribe({
      next: (data: any) => {
        this.users = data.users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToUserManagement(): void {
    // Future implementation for user management
    console.log('Navigate to user management');
  }

  navigateToSettings(): void {
    // Future implementation for settings
    console.log('Navigate to settings');
  }
}