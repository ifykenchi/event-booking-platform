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
  selector: 'app-add-event-modal',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-event-modal.component.html',
  styleUrl: './add-event-modal.component.css',
})
export class AddEventModalComponent {
  @Input() showAddModal!: boolean;
  @Output() closeAddModal = new EventEmitter();
  @Output() addClick = new EventEmitter();

  eventModalForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
    }),
    about: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(3000),
      ],
    }),
    availableSeats: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.min(0),
        Validators.max(1000000),
        Validators.required,
        this.integerValidator(),
      ],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;
      return Number.isInteger(value) ? null : { notInteger: true };
    };
  }

  get title() {
    return this.eventModalForm.controls.title;
  }
  get about() {
    return this.eventModalForm.controls.about;
  }
  get availableSeats() {
    return this.eventModalForm.controls.availableSeats;
  }
  get category() {
    return this.eventModalForm.controls.category;
  }

  closeModal() {
    this.closeAddModal.emit();
  }

  onSubmit() {
    if (this.eventModalForm.valid) {
      const addedEvent = this.eventModalForm.value;
      this.addClick.emit(addedEvent);
    }
  }
}
