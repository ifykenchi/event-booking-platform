import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './localStorage.service';
import {
  BookingI,
  bookingsResponseI,
  DeleteI,
} from '../interfaces/services.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private apiUrl = 'http://localhost:8082';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  private getUserHttpOptions() {
    const accessToken = this.localStorageService.getItem('accessToken');
    if (!accessToken) throw new Error('Token not found');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      }),
    };
  }

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

  getAllBookings(): Observable<bookingsResponseI> {
    return this.http.get<bookingsResponseI>(
      `${this.apiUrl}/admin/bookings`,
      this.getAdminHttpOptions()
    );
  }

  getUserBookings(): Observable<bookingsResponseI> {
    return this.http.get<bookingsResponseI>(
      `${this.apiUrl}/user/bookings`,
      this.getUserHttpOptions()
    );
  }

  addBooking(booking: BookingI): Observable<bookingsResponseI> {
    return this.http.post<bookingsResponseI>(
      `${this.apiUrl}/user/booking`,
      booking,
      this.getUserHttpOptions()
    );
  }

  deleteBooking(bookingId: string): Observable<DeleteI> {
    return this.http.delete<DeleteI>(
      `${this.apiUrl}/user/booking/${bookingId}`,
      this.getUserHttpOptions()
    );
  }
}
