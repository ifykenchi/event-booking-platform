import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/localStorage.service';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isAdmin: boolean = false;
  username: string = 'user';

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.localStorageService.isAdmin();
    console.log(this.isAdmin);

    if (this.isAdmin) {
      this.registerService.getAdmin().subscribe({
        next: (res) => {
          this.username = res.adminData.username;
          console.log(res);
        },
        error: (err) => console.error('Unauthorized User', err),
      });
    }

    if (!this.isAdmin) {
      this.registerService.getUser().subscribe({
        next: (res) => {
          this.username = res.userData.username;
          console.log(res);
        },
        error: (err) => console.error('Unauthorized User', err),
      });
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  logout(): void {
    this.localStorageService.clear();
    if (this.isAdmin) this.router.navigate(['/admin/login']);
    if (!this.isAdmin) this.router.navigate(['/user/login']);
  }
}
