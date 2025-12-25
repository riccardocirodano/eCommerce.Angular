import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  userID: string;
  email: string;
  personName: string;
  gender: string;
  isActive: boolean;
  roles?: string[];
  createdDate?: string;   // <-- make optional
  createdAt?: string;     // <-- add this
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  usersByRole: { [key: string]: number };
  recentUsers: User[];
  systemInfo: {
    serverTime: string;
    version: string;
  };
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface SystemSettings {
  applicationName: string;
  version: string;
  environment: string;
  maxUsersPerRole: { [key: string]: number };
  securitySettings: {
    passwordMinLength: number;
    requireEmailConfirmation: boolean;
    sessionTimeoutMinutes: number;
  };
}

export interface Role {
  roleID: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<{ stats: DashboardStats }> {
    return this.http.get<{ stats: DashboardStats }>(`${this.baseUrl}/dashboard`);
  }

    getUsers(
    page: number = 1,
    pageSize: number = 20,
    searchTerm?: string,
    roleFilter?: string
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (roleFilter) params = params.set('roleFilter', roleFilter);

    type UsersResponse = {
      users?: User[];
      Users?: User[];
      pagination?: PaginatedResponse<User>['pagination'];
      Pagination?: PaginatedResponse<User>['pagination'];
    };

    return this.http
      .get<UsersResponse>(`${this.baseUrl}/users`, { params })
      .pipe(
        map((r) => ({
          data: r.users ?? r.Users ?? [],
          pagination: r.pagination ?? r.Pagination ?? {
            currentPage: page,
            pageSize,
            totalCount: 0,
            totalPages: 0
          }
        }))
      );
  }

  getUserById(userId: string): Observable<{ user: User }> {
    type UserByIdResponse = {
      user?: any;
      User?: any;
      roles?: any[];  // backend: ["Admin"]
      Roles?: any[];
    };

    return this.http.get<UserByIdResponse>(`${this.baseUrl}/users/${userId}`).pipe(
      map((r) => {
        const user = (r.user ?? r.User) as User;

        const rawRoles = r.roles ?? r.Roles ?? [];
        const roleNames = rawRoles
          .map((x) => (typeof x === 'string' ? x : (x?.name ?? x?.roleName)))
          .filter((x): x is string => typeof x === 'string' && x.trim().length > 0);

        user.roles = roleNames;

        return { user };
      })
    );
  }

  updateUserRole(userId: string, roleName: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/users/${userId}/roles`, { roleName });
  }

  toggleUserStatus(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/users/${userId}/toggle-status`, {});
  }

  getAllRoles(): Observable<{ roles: Role[] }> {
    type RolesResponse = { roles?: any[]; Roles?: any[] };

    return this.http.get<RolesResponse>(`${this.baseUrl}/roles`).pipe(
      map(r => {
        const raw = r.roles ?? r.Roles ?? [];
        return {
          roles: raw.map(x => ({
            roleID: x.roleID ?? x.roleId,
            name: x.name ?? x.roleName
          }))
        };
      })
    );
  }

  getActivityLogs(page: number = 1, pageSize: number = 50): Observable<PaginatedResponse<ActivityLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<ActivityLog>>(`${this.baseUrl}/activity-logs`, { params });
  }

  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(`${this.baseUrl}/settings`);
  }

  private toRole(x: any): Role {
    return {
      roleID: x.roleID ?? x.roleId,
      name: x.name ?? x.roleName
    };
  }
}