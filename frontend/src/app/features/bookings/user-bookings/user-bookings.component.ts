import { Component } from '@angular/core';
import { BookedCardComponent } from '../../../core/components/booked-card/booked-card.component';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { BookingDetailsComponent } from '../../../core/components/booking-details/booking-details.component';
import { NotificationService } from '../../../services/notification.service';
import { BookingsService } from '../../../services/bookings.service';
import { RegisterService } from '../../../services/register.service';
import {
  EventI,
  BookingI,
  BookingDataI,
} from '../../../interfaces/services.interfaces';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-bookings',
  imports: [
    BookedCardComponent,
    ConfirmationModalComponent,
    BookingDetailsComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent {
  bookings: BookingDataI[] = [];
  userBookingData: any = {};
  events: EventI[] = [];
  userId: string = '';
  showConfirmModal: boolean = false;
  targetBookingId: string = '';
  modalType: string = 'cancel booking';
  message: string = 'Are you sure you want to cancel your booking?';
  showDetailsModal: boolean = false;

  constructor(
    private notification: NotificationService,
    private bookingsService: BookingsService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.registerService.getUser().subscribe({
      next: (res) => {
        this.userId = res.userData.userId;

        this.bookingsService.getUserBookings(this.userId).subscribe({
          next: (res) => {
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
    this.bookingsService.cancelBooking(this.targetBookingId).subscribe({
      next: (res) => {
        this.bookingsService.refreshUserBookings(this.userId);
        this.notification.showSuccess('Your booking has been cancelled');
        this.showConfirmModal = false;
      },
      error: (err) => {
        console.error('Failed to cancel booking', err);
        this.notification.showError('Failed to cancel booking');
      },
    });
  }

  handleOpenDetailsModal(bookingData: BookingDataI) {
    this.userBookingData = bookingData;
    this.showDetailsModal = true;
    // console.log(bookingData);
  }

  handleCloseConfirmModal() {
    this.showConfirmModal = false;
  }

  handleCloseDetailsModal() {
    this.showDetailsModal = false;
  }
}
