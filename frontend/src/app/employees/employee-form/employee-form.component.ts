import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { EmployeeService } from '../../core/employee/employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly employeeId = signal<number | null>(null);
  readonly isEdit = computed(() => this.employeeId() !== null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    position: [''],
    salary: [null as number | null, [Validators.min(0)]]
  });

  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((params) => params.get('id')),
        map((value) => (value ? Number(value) : null))
      )
      .subscribe((id) => {
        this.employeeId.set(id);
        if (id !== null && !Number.isNaN(id)) {
          this.fetchEmployee(id);
        } else {
          this.form.reset({
            name: '',
            email: '',
            position: '',
            salary: null
          });
        }
      });
  }

  private fetchEmployee(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.service
      .get(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employee) => {
          this.loading.set(false);
          this.patchForm(employee);
        },
        error: (err) => {
          console.error('Failed to load employee', err);
          this.loading.set(false);
          this.error.set('Unable to load employee details.');
        }
      });
  }

  private patchForm(employee: Employee): void {
    this.form.patchValue({
      name: employee.name ?? '',
      email: employee.email ?? '',
      position: employee.position ?? '',
      salary: employee.salary ?? null
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Employee = {
      name: raw.name ?? '',
      email: raw.email ?? '',
      position: raw.position ?? undefined,
      salary:
        raw.salary === null || raw.salary === undefined
          ? undefined
          : Number(raw.salary)
    };

    this.loading.set(true);
    this.error.set(null);

    const id = this.employeeId();
    const editing = id !== null;
    const request$ = editing
      ? this.service.update(id!, payload)
      : this.service.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (employee) => {
        this.loading.set(false);
        if (editing) {
          this.router.navigate(['/employees', employee.id ?? '']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Failed to save employee', err);
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to save employee.');
      }
    });
  }

  cancel(): void {
    const id = this.employeeId();
    if (id) {
      this.router.navigate(['/employees', id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
