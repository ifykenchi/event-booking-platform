import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';
import {
  BookingI,
  BookingDataI,
  bookingsResponseI,
  DeleteI,
} from '../interfaces/services.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private apiUrl = environment.domain;

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

  private filteredBookingsSource = new BehaviorSubject<BookingDataI[]>([]);
  filteredBookings$ = this.filteredBookingsSource.asObservable();

  setFilteredBookings(bookings: BookingDataI[]) {
    this.filteredBookingsSource.next(bookings);
  }

  refreshAdminBookings() {
    this.getAllBookings().subscribe({
      next: (res) => this.filteredBookingsSource.next(res.bookings),
    });
  }

  refreshUserBookings(userId: string) {
    this.getUserBookings(userId).subscribe({
      next: (res) => this.filteredBookingsSource.next(res.bookings),
    });
  }

  getAllBookings(): Observable<bookingsResponseI> {
    return this.http.get<bookingsResponseI>(
      `${this.apiUrl}/admin/bookings`,
      this.getAdminHttpOptions()
    );
  }

  getUserBookings(userId: string): Observable<bookingsResponseI> {
    return this.http.get<bookingsResponseI>(
      `${this.apiUrl}/user/bookings/${userId}`,
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
