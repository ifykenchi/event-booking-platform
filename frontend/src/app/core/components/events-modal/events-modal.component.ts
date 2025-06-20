import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { EventI } from '../../../interfaces/services.interfaces';
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
  selector: 'app-events-modal',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './events-modal.component.html',
  styleUrl: './events-modal.component.css',
})
export class EventsModalComponent implements OnChanges {
  @Input() eventData!: EventI;
  @Input() showModal!: boolean;
  @Output() editClick = new EventEmitter();
  @Output() modalClosed = new EventEmitter();

  eventModalForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(3), Validators.maxLength(50)],
    }),
    about: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(6), Validators.maxLength(3000)],
    }),
    totalSeats: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.min(0),
        Validators.max(1000000),
        this.integerValidator(),
      ],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.eventData) {
      this.prefillForm();
    }
    if (changes['showModal'] && this.showModal && this.eventData) {
      this.prefillForm();
    }
  }

  private prefillForm() {
    this.eventModalForm.patchValue({
      title: this.eventData.title,
      about: this.eventData.about,
      totalSeats: this.eventData.totalSeats,
      category: this.eventData.category,
    });
  }

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
  get totalSeats() {
    return this.eventModalForm.controls.totalSeats;
  }
  get category() {
    return this.eventModalForm.controls.category;
  }

  onSubmit() {
    if (this.eventModalForm.valid) {
      const formEvent = {
        ...this.eventData,
        ...this.eventModalForm.value,
      };
      const { _id, title, about, totalSeats, category } = formEvent;

      const updatedEvent = {
        _id: _id,
        title: title,
        about: about,
        totalSeats: totalSeats,
        category: category,
      };
      this.editClick.emit(updatedEvent);
      console.log(updatedEvent);
    }
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
