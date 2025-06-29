import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BookingDataI } from '../../../interfaces/services.interfaces';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  imports: [NgIf, CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
})
export class BookingDetailsComponent {
  @Input() bookingData!: BookingDataI;
  @Input() showDetailsModal!: boolean;
  @Output() closeDetailsModal = new EventEmitter();

  onCloseDetailsModal() {
    this.closeDetailsModal.emit();
  }
}
