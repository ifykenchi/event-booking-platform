import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { DashboardService } from '../../../services/dashboard.service';
import { RegisterService } from '../../../services/register.service';
import { dashboardResponseI } from '../../../interfaces/services.interfaces';
import { NgFor, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  totalEvents: number = 0;
  totalBookings: number = 0;
  mostBookedEvents: any = [];
  totalRevenue: number = 0;

  constructor(
    private notification: NotificationService,
    private dashboardService: DashboardService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.totalEvents().subscribe({
      next: (res) => {
        this.totalEvents = res.totalEvents || 0;
      },
      error: (err) => {
        console.error('failed to fetch total events', err);
      },
    });
    this.dashboardService.totalBookings().subscribe({
      next: (res) => {
        this.totalBookings = res.totalBookings || 0;
      },
      error: (err) => {
        console.error('failed to fetch total bookings', err);
      },
    });
    this.dashboardService.mostBookedEvents().subscribe({
      next: (res) => {
        this.mostBookedEvents = res.mostBookedEvents;
        console.log('mostBookedEvents fetched: ', this.mostBookedEvents);
      },
      error: (err) => {
        console.error('failed to fetch most booked events', err);
      },
    });
    this.dashboardService.totalRevenue().subscribe({
      next: (res) => {
        this.totalRevenue = res.totalRevenue || 0;
      },
      error: (err) => {
        console.error('failed to fetch total revenue', err);
      },
    });
  }
}
