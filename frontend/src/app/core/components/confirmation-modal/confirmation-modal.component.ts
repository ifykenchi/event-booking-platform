import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  @Input() message!: string;
  @Input() modalType!: string;
  @Input() showConfirmModal!: boolean;
  @Output() confirmClick = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  show: boolean = false;

  closeConfirmModal() {
    this.closeModal.emit();
  }

  handleConfirm() {
    this.confirmClick.emit();
  }
}
