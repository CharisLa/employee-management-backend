import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EmployeeService } from '../../core/employee/employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  private readonly service = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly employees$ = this.refreshTrigger$.pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap(() =>
      this.service.list().pipe(
        tap(() => this.loading.set(false)),
        catchError((err) => {
          console.error('Failed to load employees', err);
          this.loading.set(false);
          this.error.set('Failed to load employees. Please try again.');
          return of([]);
        })
      )
    )
  );

  readonly employees = toSignal(this.employees$, { initialValue: [] as Employee[] });

  goToCreate(): void {
    this.router.navigate(['/employees/new']);
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }

  deleteEmployee(employee: Employee): void {
    if (!employee.id) {
      return;
    }
    const confirmed = window.confirm(`Delete ${employee.name}?`);
    if (!confirmed) {
      return;
    }
    this.loading.set(true);
    this.service
      .delete(employee.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.refresh(),
        error: (err) => {
          console.error('Failed to delete employee', err);
          this.loading.set(false);
          this.error.set('Failed to delete employee. Please try again.');
        }
      });
  }
}
