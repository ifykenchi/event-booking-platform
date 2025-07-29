import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  totalEvents: number | undefined = 0;
  totalBookings: number | undefined = 0;
  mostBookedEvents: any = [];
  totalRevenue: number | undefined = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.totalEvents().subscribe({
      next: (res) => {
        this.totalEvents = res.totalEvents;
      },
      error: (err) => {
        console.error('failed to fetch total events', err);
      },
    });
    this.dashboardService.totalBookings().subscribe({
      next: (res) => {
        this.totalBookings = res.totalBookings;
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
        this.totalRevenue = res.totalRevenue;
      },
      error: (err) => {
        console.error('failed to fetch total revenue', err);
      },
    });
  }
}
