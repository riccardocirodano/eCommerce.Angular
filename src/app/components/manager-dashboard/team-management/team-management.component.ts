import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagerService } from '../../../services/manager.service';
import type { PaginatedResponse, User } from '../../../services/admin.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamManagementComponent {
  vm$: Observable<{ isLoading: boolean; error: string | null; team: PaginatedResponse<User> | null }>;

  constructor(private router: Router, private managerService: ManagerService) {
    this.vm$ = this.managerService.getTeamMembers(1, 20).pipe(
      map((resp) => ({ isLoading: false, error: null, team: resp ?? null })),
      startWith({ isLoading: true, error: null, team: null }),
      catchError((e: any) =>
        of({
          isLoading: false,
          error: e?.message ?? 'Failed to load team members.',
          team: null,
        })
      )
    );
  }

  back(): void {
    this.router.navigate(['/manager-dashboard']);
  }
}
