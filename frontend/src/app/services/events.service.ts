import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  searchUserEvents(query: {
    key: SearchKey;
    value: string;
  }): Observable<EventI[]> {
    const params = new HttpParams()
      .set('key', query.key)
      .set('value', query.value);

    return this.http.get<EventI[]>(`${this.apiUrl}/user/search`, {
      ...this.getUserHttpOptions(),
      params: params,
    });
  }
}
