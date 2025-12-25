import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../services/auth.service';
import { AuthenticationResponse } from '../../models/auth.models';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  currentUser: AuthenticationResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Redirect admins to admin dashboard
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin-dashboard']);
      return;
    }
    
    // Redirect regular users to user dashboard
    if (this.authService.isUser() && !this.authService.isManager()) {
      this.router.navigate(['/user-dashboard']);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToTeamManagement(): void {
    this.router.navigate(['/manager/team']);
  }

  goToReports(): void {
    this.router.navigate(['/manager/reports']);
  }

  goToTasks(): void {
    this.router.navigate(['/manager/tasks']);
  }

  goToInventory(): void {
    this.router.navigate(['/manager/inventory']);
  }

  goToSchedule(): void {
    this.router.navigate(['/manager/schedule']);
  }

  goToMyProfile(): void {
    this.router.navigate(['/manager/profile']);
  }
}