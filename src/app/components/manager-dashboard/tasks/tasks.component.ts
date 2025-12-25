import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagerService, ManagerTask } from '../../../services/manager.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-manager-tasks',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
  vm$: Observable<{ isLoading: boolean; error: string | null; tasks: ManagerTask[] }>;

  getPrimaryText(t: any): string {
    return (
      t?.title ??
      t?.name ??
      t?.taskName ??
      t?.taskTitle ??
      t?.id ??
      t?.taskId ??
      'Task'
    );
  }

  getSecondaryText(t: any): string {
    const due = t?.dueDate ?? t?.dueOn;
    const status = t?.status ?? t?.state;
    const priority = t?.priority;
    const parts = [due ? `Due: ${due}` : null, status ? `Status: ${status}` : null, priority ? `Priority: ${priority}` : null].filter(Boolean);
    return parts.join(' • ');
  }

  constructor(private router: Router, private managerService: ManagerService) {
    this.vm$ = this.managerService.getTasks().pipe(
      map((items) => ({ isLoading: false, error: null, tasks: items ?? [] })),
      startWith({ isLoading: true, error: null, tasks: [] as ManagerTask[] }),
      catchError((e: any) =>
        of({
          isLoading: false,
          error: e?.message ?? 'Failed to load tasks.',
          tasks: [] as ManagerTask[],
        })
      )
    );
  }

  back(): void {
    this.router.navigate(['/manager-dashboard']);
  }
}
