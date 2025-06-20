import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  BookingDataI,
  BookingI,
} from '../../../interfaces/services.interfaces';
import { NgIf } from '@angular/common';
import { LocalStorageService } from '../../../services/localStorage.service';

@Component({
  selector: 'app-booked-card',
  imports: [NgIf],
  templateUrl: './booked-card.component.html',
  styleUrl: './booked-card.component.css',
})
export class BookedCardComponent {
  @Input() bookingData!: BookingDataI;
  @Output() cancelBooking = new EventEmitter();
  isAdmin: boolean = false;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.isAdmin = this.localStorageService.isAdmin();
  }

  onCancelBooking() {
    // console.log('cancelled');
    this.cancelBooking.emit(this.bookingData._id);
  }
}
