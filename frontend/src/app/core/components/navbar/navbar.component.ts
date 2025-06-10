import { Component, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/localStorage.service';
import { EventsService } from '../../../services/events.service';
import { Category } from '../../../interfaces/services.interfaces';

@Component({
  selector: 'app-navbar',
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // @Output() addClick = new EventEmitter();

  isAdmin: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.localStorageService.isAdmin();
  }

  filterClick(category: Category) {
    if (this.isAdmin) {
      this.eventsService.searchAdminEvents('category', category).subscribe({
        next: (res) => {
          // console.log(res);
          this.eventsService.setFilteredEvents(res);
        },
        error: (err) => console.error('Failed Request', err),
      });
    }
    if (!this.isAdmin) {
      this.eventsService.searchUserEvents('category', category).subscribe({
        next: (res) => {
          // console.log(res);
          this.eventsService.setFilteredEvents(res);
        },
        error: (err) => console.error('Failed Request', err),
      });
    }
  }

  // onAdd() {
  //   this.addClick.emit();
  //   console.log('Added');
  // }
}
