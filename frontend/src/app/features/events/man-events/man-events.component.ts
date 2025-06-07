import { Component } from '@angular/core';
import { CardComponent } from '../../../core/components/card/card.component';
import { EventsService } from '../../../services/events.service';
import { EventI } from '../../../interfaces/services.interfaces';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-man-events',
  imports: [CardComponent, NgFor],
  templateUrl: './man-events.component.html',
  styleUrl: './man-events.component.css',
})
export class ManEventsComponent {
  events: EventI[] = [];

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
}
