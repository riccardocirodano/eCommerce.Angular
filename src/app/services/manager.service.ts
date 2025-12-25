import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import type { PaginatedResponse, User } from './admin.service';

export interface ManagerDashboardStats {
  totalUsers: number;
  usersByRole: { [key: string]: number };
  recentUsers: User[];
  serverTime: string;
}

export interface ManagerProfile {
  user: {
    userId: string | null;
    email: string | null;
    name: string | null;
  };
  roles: any[];
}

export type ManagerReport = any;
export type ManagerTask = any;
export type ManagerInventoryItem = any;
export type ManagerScheduleItem = any;

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private readonly baseUrl = `${environment.apiUrl}/manager`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<{ stats: ManagerDashboardStats }> {
    return this.http.get<any>(`${this.baseUrl}/dashboard`).pipe(
      map((r) => ({
        stats: {
          totalUsers: r?.stats?.totalUsers ?? r?.Stats?.TotalUsers ?? 0,
          usersByRole: r?.stats?.usersByRole ?? r?.Stats?.UsersByRole ?? {},
          recentUsers: r?.stats?.recentUsers ?? r?.Stats?.RecentUsers ?? [],
          serverTime: r?.stats?.serverTime ?? r?.Stats?.ServerTime ?? r?.Stats?.SystemInfo?.ServerTime ?? ''
        }
      }))
    );
  }

  getTeamMembers(
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

    type TeamResponse = {
      users?: User[];
      Users?: User[];
      pagination?: PaginatedResponse<User>['pagination'];
      Pagination?: PaginatedResponse<User>['pagination'];
    };

    return this.http.get<TeamResponse>(`${this.baseUrl}/team`, { params }).pipe(
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

  getMyProfile(): Observable<ManagerProfile> {
    return this.http.get<any>(`${this.baseUrl}/profile`).pipe(
      map((r) => ({
        user: r?.user ?? r?.User ?? { userId: null, email: null, name: null },
        roles: r?.roles ?? r?.Roles ?? [],
      }))
    );
  }

  getReports(): Observable<ManagerReport[]> {
    return this.http.get<any>(`${this.baseUrl}/reports`).pipe(
      map((r) => r?.reports ?? r?.Reports ?? [])
    );
  }

  getTasks(): Observable<ManagerTask[]> {
    return this.http.get<any>(`${this.baseUrl}/tasks`).pipe(
      map((r) => r?.tasks ?? r?.Tasks ?? [])
    );
  }

  getInventory(): Observable<ManagerInventoryItem[]> {
    return this.http.get<any>(`${this.baseUrl}/inventory`).pipe(
      map((r) => r?.inventory ?? r?.Inventory ?? [])
    );
  }

  getSchedule(): Observable<ManagerScheduleItem[]> {
    return this.http.get<any>(`${this.baseUrl}/schedule`).pipe(
      map((r) => r?.schedule ?? r?.Schedule ?? [])
    );
  }
}
