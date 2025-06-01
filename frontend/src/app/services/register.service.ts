import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { signupPost, loginPost } from '../interfaces/services.interfaces';

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

  constructor(private http: HttpClient) {}

  adminSignup(newAdmin: signupPost): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin/register`,
      newAdmin,
      httpOptions
    );
  }

  adminLogin(newAdmin: loginPost): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, newAdmin, httpOptions);
  }

  userSignup(newUser: signupPost): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, newUser, httpOptions);
  }

  userLogin(newUser: loginPost): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, newUser, httpOptions);
  }
}
