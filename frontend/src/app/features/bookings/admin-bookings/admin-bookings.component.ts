import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { BookingsService } from '../../../services/bookings.service';
import { RegisterService } from '../../../services/register.service';
import { EventI, BookingDataI } from '../../../interfaces/services.interfaces';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-bookings',
  imports: [NgFor, NgIf, ConfirmationModalComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css',
})
export class AdminBookingsComponent {
  bookings: BookingDataI[] = [];
  events: EventI[] = [];
  showConfirmModal: boolean = false;
  targetBookingId: string = '';
  modalType: string = 'delete booking';
  message: string = 'this is irreversible. Are you sure you want to delete?';

  constructor(
    private notification: NotificationService,
    private bookingsService: BookingsService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.bookingsService.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res.bookings;
      },
      error: (err) => console.error('Failed to load bookings', err),
    });

    this.bookingsService.filteredBookings$.subscribe((bookings) => {
      this.bookings = bookings;
    });
  }

  handleDeleteBooking(bookingId: string) {
    this.showConfirmModal = true;
    this.targetBookingId = bookingId;
  }

  handleCloseConfirmModal() {
    this.showConfirmModal = false;
  }

  handleConfirmDeleteBooking() {
    this.bookingsService.deleteBooking(this.targetBookingId).subscribe({
      next: (res) => {
        this.bookingsService.refreshAdminBookings();
        this.notification.showSuccess('the booking has been deleted');
        this.showConfirmModal = false;
      },
      error: (err) => {
        console.error('Failed to delete booking', err);
        this.notification.showError('Failed to delete booking');
      },
    });
  }
}
