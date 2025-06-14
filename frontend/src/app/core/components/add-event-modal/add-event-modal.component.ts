import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
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
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get title() {
    return this.eventModalForm.controls.title;
  }
  get about() {
    return this.eventModalForm.controls.about;
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
