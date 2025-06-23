import { Component } from '@angular/core';
import { BookedCardComponent } from '../../../core/components/booked-card/booked-card.component';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { NotificationService } from '../../../services/notification.service';
import { BookingsService } from '../../../services/bookings.service';
import { RegisterService } from '../../../services/register.service';
import {
  EventI,
  BookingI,
  BookingDataI,
} from '../../../interfaces/services.interfaces';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-user-bookings',
  imports: [BookedCardComponent, ConfirmationModalComponent, NgFor],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent {
  bookings: BookingDataI[] = [];
  events: EventI[] = [];
  userId: string = '';
  showConfirmModal: boolean = false;
  targetBookingId: string = '';
  modalType: string = 'cancel booking';
  message: string = 'Are you sure you want to cancel your booking?';

  constructor(
    private notification: NotificationService,
    private bookingsService: BookingsService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.registerService.getUser().subscribe({
      next: (res) => {
        this.userId = res.userData.userId;
        // console.log(this.userId);

        this.bookingsService.getUserBookings(this.userId).subscribe({
          next: (res) => {
            // console.log(res.bookings);
            this.bookings = res.bookings;
          },
          error: (err) => console.error('Failed to load bookings', err),
        });

        this.bookingsService.filteredBookings$.subscribe((bookings) => {
          this.bookings = bookings;
        });
      },
      error: (err) => console.error('Unauthorized User', err),
    });
  }

  handleCancelBooking(bookingId: string) {
    this.showConfirmModal = true;
    this.targetBookingId = bookingId;
  }

  handleConfirmCancelBooking() {
    this.bookingsService.deleteBooking(this.targetBookingId).subscribe({
      next: (res) => {
        this.bookingsService.refreshUserBookings(this.userId);
        this.notification.showSuccess('Your booking has been cancelled');
        this.showConfirmModal = false;
      },
      error: (err) => {
        console.error('Failed to delete booking', err);
        this.notification.showError('Failed to cancel booking');
      },
    });
  }

  handleCloseConfirmModal() {
    this.showConfirmModal = false;
  }
}
