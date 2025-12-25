import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { UserManagementComponent } from './components/admin-dashboard/user-management/user-management.component';
import { TeamManagementComponent } from './components/manager-dashboard/team-management/team-management.component';
import { ReportsComponent } from './components/manager-dashboard/reports/reports.component';
import { TasksComponent } from './components/manager-dashboard/tasks/tasks.component';
import { InventoryComponent } from './components/manager-dashboard/inventory/inventory.component';
import { ScheduleComponent } from './components/manager-dashboard/schedule/schedule.component';
import { MyProfileComponent } from './components/manager-dashboard/my-profile/my-profile.component';
import { authGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ManagerGuard } from './guards/manager.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // Legacy route
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard, AdminGuard] },
  { path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate: [authGuard, ManagerGuard] },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  {
    path: 'manager',
    canActivate: [authGuard, ManagerGuard],
    children: [
      { path: 'team', component: TeamManagementComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'profile', component: MyProfileComponent },
    ]
  },
  { 
    path: 'admin', 
    canActivate: [authGuard, AdminGuard],
    children: [
      { path: 'users', component: UserManagementComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
