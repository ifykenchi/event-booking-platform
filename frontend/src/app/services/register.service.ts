import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { signupPost, loginPost } from '../interfaces/services.interfaces';
import { LocalStorageService } from './localStorage.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8082';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

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
