import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { finalize, timeout, forkJoin, of, map, switchMap, catchError } from 'rxjs';
import { AdminService, User, Role } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['personName', 'email', 'roles', 'isActive', 'createdDate', 'actions'];
  users: User[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 20;
  isLoading = false;
  
  searchControl = new FormControl('');
  roleFilterControl = new FormControl('');
  roles: Role[] = [];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/user-dashboard']);
      return;
    }

    this.loadRoles();
    this.loadUsers();
    this.setupSearchSubscription();
  }

  setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadUsers();
      });

    this.roleFilterControl.valueChanges
      .pipe(skip(1), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadUsers();
      });
  }

  loadUsers(): void {
  this.isLoading = true;
  this.cdr.detectChanges();

  const searchTerm = this.searchControl.value || undefined;
  const roleFilter = this.roleFilterControl.value || undefined;

  this.adminService
    .getUsers(this.currentPage, this.pageSize, searchTerm, roleFilter)
    .pipe(
      timeout(15000),
      switchMap((response) =>
        this.enrichUsersWithRoles(response.data).pipe(
          map((usersWithRoles) => ({ ...response, data: usersWithRoles }))
        )
      ),
      finalize(() => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      })
    )
    .subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          this.users = response.data ?? [];
          this.totalCount = response.pagination?.totalCount ?? 0;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.ngZone.run(() => {
          this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
          this.cdr.detectChanges();
        });
      }
    });
}

  loadRoles(): void {
    this.adminService.getAllRoles().subscribe({
      next: (response) => {
        setTimeout(() => {
          this.roles = response.roles;
        }, 0);
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  editUser(user: User): void {
    this.adminService.getUserById(user.userID).subscribe({
      next: ({ user: fullUser }) => {
        // Ensure we have available roles for the dropdown
        if (!this.roles?.length) {
          this.adminService.getAllRoles().subscribe({
            next: (r) => this.openEditDialog(fullUser, r.roles),
            error: () => this.snackBar.open('Failed to load roles', 'Close', { duration: 3000 })
          });
          return;
        }

        this.openEditDialog(fullUser, this.roles);
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.snackBar.open('Failed to load user details', 'Close', { duration: 3000 });
      }
    });
  }

  private openEditDialog(user: User, roles: Role[]) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: { user, roles }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  toggleUserStatus(user: User): void {
    this.adminService.toggleUserStatus(user.userID).subscribe({
      next: () => {
        this.snackBar.open(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`, 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.snackBar.open('Failed to update user status', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  formatRoles(roles: string[]): string {
    return roles.join(', ');
  }

  formatDate(user: any): string {
    const value = user?.createdDate ?? user?.createdAt;
    return value ? new Date(value).toLocaleDateString() : '';
  }

  private enrichUsersWithRoles(users: User[]) {
    if (!users?.length) return of([] as User[]);

    return forkJoin(
      users.map((u) =>
        this.adminService.getUserById(u.userID).pipe(
          map(({ user }) => ({ ...u, roles: user.roles ?? [] })),
          catchError(() => of(u))
        )
      )
    );
  }
}