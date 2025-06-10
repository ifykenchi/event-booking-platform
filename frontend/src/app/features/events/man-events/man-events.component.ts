import { Component } from '@angular/core';
import { CardComponent } from '../../../core/components/card/card.component';
import { EventsService } from '../../../services/events.service';
import { EventI } from '../../../interfaces/services.interfaces';
import { NgFor } from '@angular/common';
import { EventsModalComponent } from '../../../core/components/events-modal/events-modal.component';
import { AddEventModalComponent } from '../../../core/components/add-event-modal/add-event-modal.component';

@Component({
  selector: 'app-man-events',
  imports: [CardComponent, NgFor, EventsModalComponent, AddEventModalComponent],
  templateUrl: './man-events.component.html',
  styleUrl: './man-events.component.css',
})
export class ManEventsComponent {
  events: EventI[] = [];
  eventData!: EventI;
  showModal: boolean = false;
  showAddModal: boolean = false;

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.eventsService.getAdminEvents().subscribe({
      next: (res) => {
        this.events = res.events;
        // console.log('Success!', this.events);
      },
      error: (err) => console.error('Failed to load events!', err),
    });

    this.eventsService.filteredEvents$.subscribe((events) => {
      // if (events.length > 0) {
      //   this.events = events;
      // }
      this.events = events;
    });
  }

  handleDelete(eventId: string) {
    // console.log(eventId);
    this.eventsService.deleteAdminEvent(eventId).subscribe({
      next: (res) => {
        // console.log(res);
        this.eventsService.refreshAdminEvents();
      },
      error: (err) => console.error('Failed to delete event!', err),
    });
  }

  showEventsModal(eventData: EventI) {
    this.showModal = true;
    this.eventData = eventData;
    // console.log(this.showModal, this.eventData);
  }

  handleEdit(updatedEvent: Partial<EventI>) {
    // console.log('Event to edit: ', eventToEdit);
    if (!updatedEvent?._id) {
      console.error('No event ID provided for editing');
      return;
    }

    // console.log(updatedEvent._id, updatedEvent);

    this.eventsService
      .editAdminEvent(updatedEvent._id, updatedEvent)
      .subscribe({
        next: (res) => {
          console.log('Event updated successfully', res);
          this.eventsService.refreshAdminEvents();
          this.showModal = false;
        },
        error: (err) => {
          console.error('Failed to update event', err);
          // this.showModal = false;
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
      },
      error: (err) => {
        console.error('Failed to add event', err);
        // this.showAddModal = false;
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
