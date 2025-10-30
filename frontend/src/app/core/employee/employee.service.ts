import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../shared/models/employee.model';

const API_BASE_URL = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = `${API_BASE_URL}/employees`;

  list(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.resourceUrl);
  }

  get(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.resourceUrl}/${id}`);
  }

  create(payload: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.resourceUrl, payload);
  }

  update(id: number, payload: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
