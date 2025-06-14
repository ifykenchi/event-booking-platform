import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  isLoggedIn(): boolean {
    if (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('adminToken')
    ) {
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    if (localStorage.getItem('adminToken')) return true;
    return false;
  }

  clear(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('adminToken');
  }
}
