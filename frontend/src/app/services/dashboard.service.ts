import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';
import { dashboardResponseI } from '../interfaces/services.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.domain;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  private getAdminHttpOptions() {
    const adminToken = this.localStorageService.getItem('adminToken');
    if (!adminToken) throw new Error('No access token found');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      }),
    };
  }

  totalEvents(): Observable<dashboardResponseI> {
    return this.http.get<dashboardResponseI>(
      `${this.apiUrl}/admin/dashboard/events`,
      this.getAdminHttpOptions()
    );
  }

  totalBookings(): Observable<dashboardResponseI> {
    return this.http.get<dashboardResponseI>(
      `${this.apiUrl}/admin/dashboard/bookings`,
      this.getAdminHttpOptions()
    );
  }

  mostBookedEvents(): Observable<dashboardResponseI> {
    return this.http.get<dashboardResponseI>(
      `${this.apiUrl}/admin/dashboard/most-booked-events`,
      this.getAdminHttpOptions()
    );
  }

  totalRevenue(): Observable<dashboardResponseI> {
    return this.http.get<dashboardResponseI>(
      `${this.apiUrl}/admin/dashboard/total-revenue`,
      this.getAdminHttpOptions()
    );
  }
}
