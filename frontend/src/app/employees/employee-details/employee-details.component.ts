import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { EmployeeService } from '../../core/employee/employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent {
  private readonly service = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((params) => params.get('id')),
        map((value) => (value ? Number(value) : null)),
        filter((id): id is number => id !== null && !Number.isNaN(id)),
        switchMap((id) => {
          this.loading.set(true);
          this.error.set(null);
          return this.service.get(id);
        })
      )
      .subscribe({
        next: (employee) => {
          this.loading.set(false);
          this.employee.set(employee);
        },
        error: (err) => {
          console.error('Failed to load employee', err);
          this.loading.set(false);
          this.error.set('Unable to load employee.');
        }
      });
  }

  edit(): void {
    const current = this.employee();
    if (current?.id) {
      this.router.navigate(['/employees', current.id, 'edit']);
    }
  }

  delete(): void {
    const current = this.employee();
    if (!current?.id) {
      return;
    }
    const confirmed = window.confirm(`Delete ${current.name}?`);
    if (!confirmed) {
      return;
    }
    this.loading.set(true);
    this.service
      .delete(current.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
        console.error('Failed to delete employee', err);
        this.loading.set(false);
        this.error.set('Failed to delete employee.');
      }
      });
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
