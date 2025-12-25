import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthenticationResponse } from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<AuthenticationResponse | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(request: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setAuthData(response);
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setAuthData(response);
          }
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): AuthenticationResponse | null {
    if (this.isBrowser) {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

    getUserRoles(): string[] {
    const roles = new Set<string>();

    // 1) Prefer roles already present on the stored user object (if backend includes them)
    const currentUser = this.getCurrentUser();
    (currentUser?.roles ?? [])
      .filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
      .forEach(r => roles.add(r));

    // 2) Extract from JWT payload (supports common backend claim keys)
    const token = this.getToken();
    if (!token) return Array.from(roles);

    try {
      const base64 = token.split('.')[1];
      if (!base64) return Array.from(roles);

      const payload = JSON.parse(atob(base64));

      const candidates = [
        payload.role,
        payload.roles,
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'],
      ];

      for (const value of candidates) {
        if (Array.isArray(value)) {
          value
            .filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
            .forEach(r => roles.add(r));
        } else if (typeof value === 'string' && value.trim().length > 0) {
          roles.add(value);
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    return Array.from(roles);
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isManager(): boolean {
    return this.hasRole('Manager');
  }

  isUser(): boolean {
    return this.hasRole('User');
  }

  getUserDashboardRoute(): string {
    if (this.isAdmin()) {
      return '/admin-dashboard';
    } else if (this.isManager()) {
      return '/manager-dashboard';
    } else {
      return '/user-dashboard';
    }
  }

  private setAuthData(response: AuthenticationResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    }
    this.currentUserSubject.next(response);
  }
}
