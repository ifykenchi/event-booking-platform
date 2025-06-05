import { Component } from '@angular/core';
import { CardComponent } from '../../../core/components/card/card.component';
import { EventsService } from '../../../services/events.service';
import { EventI } from '../../../interfaces/services.interfaces';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-view-events',
  imports: [CardComponent, NgFor],
  templateUrl: './view-events.component.html',
  styleUrl: './view-events.component.css',
})
export class ViewEventsComponent {
  events: EventI[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.eventsService.getUserEvents().subscribe({
      next: (res) => {
        this.events = res.events;
        console.log('Success!', this.events);
      },
      error: (err) => console.error('Failed to load events!', err),
    });
  }
}
