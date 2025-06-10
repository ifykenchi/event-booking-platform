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
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(3), Validators.maxLength(50)],
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
      category: this.eventData.category,
    });
  }

  get title() {
    return this.eventModalForm.controls.title;
  }
  get about() {
    return this.eventModalForm.controls.about;
  }
  get category() {
    return this.eventModalForm.controls.category;
  }

  onSubmit() {
    if (this.eventModalForm.valid) {
      const updatedEvent = {
        ...this.eventData,
        ...this.eventModalForm.value,
      };
      // Emit the data
      this.editClick.emit(updatedEvent);
    }
  }

  closeModal() {
    this.showModal = false;
    this.modalClosed.emit();
  }
}
