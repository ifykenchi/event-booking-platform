import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { LocalStorageService } from './services/localStorage.service';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  get showSidebar(): boolean {
    const isAuthRoute = [
      '/user/login',
      '/user/register',
      '/admin/login',
      '/admin/register',
    ].some((route) => this.router.url.startsWith(route));
    return this.localStorageService.isLoggedIn() && !isAuthRoute;
  }
}
