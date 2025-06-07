import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './localStorage.service';
import {
  responseI,
  EventI,
  SearchKey,
  DeleteI,
} from '../interfaces/services.interfaces';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
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

  private filteredEventsSource = new BehaviorSubject<EventI[]>([]);
  filteredEvents$ = this.filteredEventsSource.asObservable();

  setFilteredEvents(events: EventI[]) {
    this.filteredEventsSource.next(events);
  }

  getAdminEvents(): Observable<responseI> {
    return this.http.get<responseI>(
      `${this.apiUrl}/admin/events`,
      this.getAdminHttpOptions()
    );
  }

  getAdminEvent(eventId: string): Observable<responseI> {
    return this.http.get<responseI>(
      `${this.apiUrl}/admin/events/${eventId}`,
      this.getAdminHttpOptions()
    );
  }

  addAdminEvent(eventData: EventI): Observable<responseI> {
    return this.http.post<responseI>(
      `${this.apiUrl}/admin/event`,
      eventData,
      this.getAdminHttpOptions()
    );
  }

  editAdminEvent(
    eventId: string,
    eventData: Partial<EventI>
  ): Observable<responseI> {
    return this.http.patch<responseI>(
      `${this.apiUrl}/admin/event/${eventId}`,
      eventData,
      this.getAdminHttpOptions()
    );
  }

  searchAdminEvents(key: SearchKey, value: string): Observable<EventI[]> {
    const params = new HttpParams().set('key', key).set('value', value);

    return this.http.get<EventI[]>(`${this.apiUrl}/admin/search`, {
      ...this.getAdminHttpOptions(),
      params: params,
    });
  }

  deleteAdminEvent(eventId: string): Observable<DeleteI> {
    return this.http.delete<DeleteI>(
      `${this.apiUrl}/admin/delete/${eventId}`,
      this.getAdminHttpOptions()
    );
  }

  getUserEvents(): Observable<responseI> {
    return this.http.get<responseI>(
      `${this.apiUrl}/user/events`,
      this.getUserHttpOptions()
    );
  }

  searchUserEvents(key: SearchKey, value: string): Observable<EventI[]> {
    const params = new HttpParams().set('key', key).set('value', value);

    return this.http.get<EventI[]>(`${this.apiUrl}/user/search`, {
      ...this.getUserHttpOptions(),
      params: params,
    });
  }
}
