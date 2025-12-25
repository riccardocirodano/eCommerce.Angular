import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagerScheduleItem, ManagerService } from '../../../services/manager.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-manager-schedule',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  vm$: Observable<{ isLoading: boolean; error: string | null; schedule: ManagerScheduleItem[] }>;

  constructor(private router: Router, private managerService: ManagerService) {
    this.vm$ = this.managerService.getSchedule().pipe(
      map((items) => ({ isLoading: false, error: null, schedule: items ?? [] })),
      startWith({ isLoading: true, error: null, schedule: [] as ManagerScheduleItem[] }),
      catchError((e: any) =>
        of({
          isLoading: false,
          error: e?.message ?? 'Failed to load schedule.',
          schedule: [] as ManagerScheduleItem[],
        })
      )
    );
  }

  back(): void {
    this.router.navigate(['/manager-dashboard']);
  }

  getTitle(item: unknown): string {
    const x: any = item as any;
    return x?.title ?? x?.name ?? 'Schedule Entry';
  }

  getStart(item: unknown): any {
    const x: any = item as any;
    return x?.startTime ?? x?.start ?? x?.from ?? x?.startDate ?? null;
  }

  getEnd(item: unknown): any {
    const x: any = item as any;
    return x?.endTime ?? x?.end ?? x?.to ?? x?.endDate ?? null;
  }
}
