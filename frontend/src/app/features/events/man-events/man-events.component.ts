import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import { CardComponent } from '../../../core/components/card/card.component';
import { EventsService } from '../../../services/events.service';
import { EventI } from '../../../interfaces/services.interfaces';
import { NgFor } from '@angular/common';
import { EventsModalComponent } from '../../../core/components/events-modal/events-modal.component';
import { AddEventModalComponent } from '../../../core/components/add-event-modal/add-event-modal.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-man-events',
  imports: [
    CardComponent,
    NgFor,
    EventsModalComponent,
    AddEventModalComponent,
    NavbarComponent,
  ],
  templateUrl: './man-events.component.html',
  styleUrl: './man-events.component.css',
})
export class ManEventsComponent {
  events: EventI[] = [];
  eventData!: EventI;
  showModal: boolean = false;
  showAddModal: boolean = false;

  constructor(
    private eventsService: EventsService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.eventsService.getAdminEvents().subscribe({
      next: (res) => {
        this.events = res.events;
      },
      error: (err) => console.error('Failed to load events!', err),
    });

    this.eventsService.filteredEvents$.subscribe((events) => {
      this.events = events;
    });
  }

  handleDelete(eventId: string) {
    this.eventsService.deleteAdminEvent(eventId).subscribe({
      next: (res) => {
        this.eventsService.refreshAdminEvents();
        this.notification.showSuccess('Event Deleted');
      },
      error: (err) => {
        console.error('Failed to delete event!', err);
        this.notification.showSuccess('An error occured. Please try again');
      },
    });
  }

  showEventsModal(eventData: EventI) {
    this.showModal = true;
    this.eventData = eventData;
  }

  handleEdit(updatedEvent: Partial<EventI>) {
    if (!updatedEvent?._id) {
      console.error('No event ID provided for editing');
      return;
    }

    this.eventsService
      .editAdminEvent(updatedEvent._id, updatedEvent)
      .subscribe({
        next: (res) => {
          console.log('Event updated successfully', res);
          this.eventsService.refreshAdminEvents();
          this.showModal = false;
          this.notification.showSuccess('Event updated');
        },
        error: (err) => {
          console.error('Failed to update event', err);
          this.notification.showError('Event update Failed');
        },
      });
  }

  handleAddEvent(addedEvent: EventI) {
    if (!addedEvent) {
      console.error('Submitted Event cannot be empty');
      return;
    }

    this.eventsService.addAdminEvent(addedEvent).subscribe({
      next: (res) => {
        console.log('Event added successfully', res);
        this.eventsService.refreshAdminEvents();
        this.showAddModal = false;
        this.notification.showSuccess('Event created');
      },
      error: (err) => {
        console.error('Failed to add event', err);
        this.notification.showError('Event creation failed. Please try again.');
      },
    });
  }

  displayAddModal() {
    this.showAddModal = true;
    console.log(this.showAddModal);
  }

  handleModalClosed() {
    this.showModal = false;
  }

  handleCloseAddModal() {
    this.showAddModal = false;
  }
}
