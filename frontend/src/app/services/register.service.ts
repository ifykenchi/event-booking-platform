import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  signupPost,
  loginPost,
  UserDataResponseI,
  AdminDataResponseI,
} from '../interfaces/services.interfaces';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
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

  getAdmin(): Observable<AdminDataResponseI> {
    return this.http.get<AdminDataResponseI>(
      `${this.apiUrl}/admin`,
      this.getAdminHttpOptions()
    );
  }

  getUser(): Observable<UserDataResponseI> {
    return this.http.get<UserDataResponseI>(
      `${this.apiUrl}/user`,
      this.getUserHttpOptions()
    );
  }

  adminSignup(newAdmin: signupPost): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/admin/register`, newAdmin, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response?.adminToken) {
            this.localStorageService.setItem('adminToken', response.adminToken);
          }
        })
      );
  }

  adminLogin(newAdmin: loginPost): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/admin/login`, newAdmin, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response?.adminToken) {
            this.localStorageService.setItem('adminToken', response.adminToken);
          }
        })
      );
  }

  userSignup(newUser: signupPost): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user/register`, newUser, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response?.accessToken) {
            this.localStorageService.setItem(
              'accessToken',
              response.accessToken
            );
          }
        })
      );
  }

  userLogin(newUser: loginPost): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user/login`, newUser, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response?.accessToken) {
            this.localStorageService.setItem(
              'accessToken',
              response.accessToken
            );
          }
        })
      );
  }
}
