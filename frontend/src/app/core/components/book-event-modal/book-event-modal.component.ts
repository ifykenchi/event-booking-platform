import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-book-event-modal',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './book-event-modal.component.html',
  styleUrl: './book-event-modal.component.css',
})
export class BookEventModalComponent {
  @Input() showBookingModal!: boolean;
  @Input() eventId!: string;
  @Input() userId!: string;
  @Output() closeBookingModal = new EventEmitter();
  @Output() bookClick = new EventEmitter();

  bookingModalForm = new FormGroup({
    fullName: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(254),
      ],
    }),
    phoneNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\+?[0-9\s\-\(\)]{6,20}$/),
      ],
    }),
  });

  get fullName() {
    return this.bookingModalForm.controls.fullName;
  }
  get email() {
    return this.bookingModalForm.controls.email;
  }
  get phoneNumber() {
    return this.bookingModalForm.controls.phoneNumber;
  }

  closeModal() {
    this.closeBookingModal.emit();
  }

  onSubmit() {
    if (this.bookingModalForm.valid) {
      const addedBooking = {
        eventId: this.eventId,
        userId: this.userId,
        userDetails: {
          fullName: this.fullName.value,
          email: this.email.value,
          phoneNumber: this.phoneNumber.value,
        },
      };
      this.bookClick.emit(addedBooking);
      // console.log('Booking Form Submitted: ', addedBooking);
    }
  }
}
