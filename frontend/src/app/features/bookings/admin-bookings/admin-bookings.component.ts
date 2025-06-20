import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { BookingsService } from '../../../services/bookings.service';
import { RegisterService } from '../../../services/register.service';
import { EventI, BookingDataI } from '../../../interfaces/services.interfaces';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-bookings',
  imports: [NgFor, NgIf],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css',
})
export class AdminBookingsComponent {
  bookings: BookingDataI[] = [];
  events: EventI[] = [];

  constructor(
    private notification: NotificationService,
    private bookingsService: BookingsService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.bookingsService.getAllBookings().subscribe({
      next: (res) => {
        // console.log(res.bookings);
        this.bookings = res.bookings;
      },
      error: (err) => console.error('Failed to load bookings', err),
    });
  }
}
