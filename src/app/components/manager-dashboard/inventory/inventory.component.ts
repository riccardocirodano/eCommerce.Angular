import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagerInventoryItem, ManagerService } from '../../../services/manager.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-manager-inventory',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent {
  vm$: Observable<{ isLoading: boolean; error: string | null; inventory: ManagerInventoryItem[] }>;

  getPrimaryText(item: any): string {
    return (
      item?.name ??
      item?.title ??
      item?.sku ??
      item?.productName ??
      item?.id ??
      item?.itemId ??
      'Inventory Item'
    );
  }

  getSecondaryText(item: any): string {
    const qty = item?.quantity ?? item?.qty ?? item?.stock;
    const status = item?.status;
    const parts = [qty !== undefined ? `Qty: ${qty}` : null, status ? `Status: ${status}` : null].filter(Boolean);
    return parts.join(' • ');
  }

  constructor(private router: Router, private managerService: ManagerService) {
    this.vm$ = this.managerService.getInventory().pipe(
      map((items) => ({ isLoading: false, error: null, inventory: items ?? [] })),
      startWith({ isLoading: true, error: null, inventory: [] as ManagerInventoryItem[] }),
      catchError((e: any) =>
        of({
          isLoading: false,
          error: e?.message ?? 'Failed to load inventory.',
          inventory: [] as ManagerInventoryItem[],
        })
      )
    );
  }

  back(): void {
    this.router.navigate(['/manager-dashboard']);
  }
}
