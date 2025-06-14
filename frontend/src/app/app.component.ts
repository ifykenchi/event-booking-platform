import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { LocalStorageService } from './services/localStorage.service';
import { NgIf } from '@angular/common';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  get showComponent(): boolean {
    const isAuthRoute = [
      '/user/login',
      '/user/register',
      '/admin/login',
      '/admin/register',
    ].some((route) => this.router.url.startsWith(route));
    return this.localStorageService.isLoggedIn() && !isAuthRoute;
  }
}
