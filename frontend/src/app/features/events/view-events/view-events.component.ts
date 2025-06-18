import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import { CardComponent } from '../../../core/components/card/card.component';
import { EventsService } from '../../../services/events.service';
import { RegisterService } from '../../../services/register.service';
import { BookEventModalComponent } from '../../../core/components/book-event-modal/book-event-modal.component';
import { EventI } from '../../../interfaces/services.interfaces';
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
    private registerService: RegisterService
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
}
