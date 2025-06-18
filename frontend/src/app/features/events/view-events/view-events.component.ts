import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import { CardComponent } from '../../../core/components/card/card.component';
import { EventsService } from '../../../services/events.service';
import { RegisterService } from '../../../services/register.service';
import { BookingsService } from '../../../services/bookings.service';
import { BookEventModalComponent } from '../../../core/components/book-event-modal/book-event-modal.component';
import { NotificationService } from '../../../services/notification.service';
import { EventI, BookingI } from '../../../interfaces/services.interfaces';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-view-events',
  imports: [NavbarComponent, CardComponent, BookEventModalComponent, NgFor],
  templateUrl: './view-events.component.html',
  styleUrl: './view-events.component.css',
})
export class ViewEventsComponent {
  events: EventI[] = [];
  userId: string = '';
  eventId: string = '';
  showModal: boolean = false;

  constructor(
    private eventsService: EventsService,
    private registerService: RegisterService,
    private bookingsService: BookingsService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.eventsService.getUserEvents().subscribe({
      next: (res) => {
        this.events = res.events;
      },
      error: (err) => console.error('Failed to load events!', err),
    });

    this.registerService.getUser().subscribe({
      next: (res) => {
        this.userId = res.userData.userId;
      },
      error: (err) => console.error('Unauthorized User', err),
    });

    this.eventsService.filteredEvents$.subscribe((events) => {
      this.events = events;
    });
  }

  showBookModal(eventId: string) {
    this.showModal = true;
    this.eventId = eventId;
  }

  handleCloseBookingModal() {
    this.showModal = false;
  }

  handleBookEvent(addedBooking: BookingI) {
    if (!addedBooking) {
      console.error('Submitted Booking cannot be empty');
      return;
    }

    this.bookingsService.addBooking(addedBooking).subscribe({
      next: (res) => {
        console.log('Booking added successfully', res);
        this.eventsService.refreshUserEvents();
        this.showModal = false;
        this.notification.showSuccess('Event has been Booked');
      },
      error: (err) => {
        console.error('Failed to book event', err);
        this.notification.showError('event booking failed. please try again.');
      },
    });
  }
}
