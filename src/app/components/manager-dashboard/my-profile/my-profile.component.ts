import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagerService, ManagerProfile } from '../../../services/manager.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-manager-my-profile',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent {
  vm$: Observable<{ isLoading: boolean; error: string | null; profile: ManagerProfile | null }>;

  constructor(private router: Router, private managerService: ManagerService) {
    this.vm$ = this.managerService.getMyProfile().pipe(
      map((p) => ({ isLoading: false, error: null, profile: p ?? null })),
      startWith({ isLoading: true, error: null, profile: null }),
      catchError((e: any) =>
        of({
          isLoading: false,
          error: e?.message ?? 'Failed to load profile.',
          profile: null,
        })
      )
    );
  }

  back(): void {
    this.router.navigate(['/manager-dashboard']);
  }
}
