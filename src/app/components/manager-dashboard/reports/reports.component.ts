import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagerService, ManagerReport } from '../../../services/manager.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-manager-reports',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  vm$: Observable<{ isLoading: boolean; error: string | null; reports: ManagerReport[] }>;

  getPrimaryText(r: any): string {
    return (
      r?.title ??
      r?.name ??
      r?.reportName ??
      r?.reportTitle ??
      r?.id ??
      r?.reportId ??
      'Report'
    );
  }

  getSecondaryText(r: any): string {
    const created = r?.createdAt ?? r?.createdDate ?? r?.createdOn;
    const status = r?.status ?? r?.state;
    const parts = [created ? `Created: ${created}` : null, status ? `Status: ${status}` : null].filter(Boolean);
    return parts.join(' • ');
  }

  constructor(private router: Router, private managerService: ManagerService) {
    this.vm$ = this.managerService.getReports().pipe(
      map((items) => ({ isLoading: false, error: null, reports: items ?? [] })),
      startWith({ isLoading: true, error: null, reports: [] as ManagerReport[] }),
      catchError((e: any) =>
        of({
          isLoading: false,
          error: e?.message ?? 'Failed to load reports.',
          reports: [] as ManagerReport[],
        })
      )
    );
  }

  back(): void {
    this.router.navigate(['/manager-dashboard']);
  }
}
