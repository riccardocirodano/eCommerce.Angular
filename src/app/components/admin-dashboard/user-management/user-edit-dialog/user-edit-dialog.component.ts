import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, User, Role } from '../../../../services/admin.service';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Edit User</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="personName" readonly>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" readonly>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option *ngFor="let role of data.roles" [value]="role.name">
              {{role.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="editForm.invalid || isLoading">
        {{isLoading ? 'Saving...' : 'Save'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-dialog-content {
      min-width: 400px;
    }
    
    mat-dialog-actions {
      justify-content: flex-end;
    }
  `]
})
export class UserEditDialogComponent {
  editForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; roles: Role[] }
  ) {
    const initialRole =
      Array.isArray(data.user.roles) && data.user.roles.length > 0
        ? data.user.roles[0]
        : (data.roles?.[0]?.name ?? '');

    this.editForm = this.fb.group({
      personName: [data.user.personName],
      email: [data.user.email],
      role: [initialRole, Validators.required]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.isLoading = true;
      const newRole = this.editForm.value.role;
      
      this.adminService.updateUserRole(this.data.user.userID, newRole).subscribe({
        next: () => {
          this.snackBar.open('User role updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating user role:', error);
          this.snackBar.open('Failed to update user role', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}