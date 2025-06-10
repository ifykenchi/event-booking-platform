import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventI } from '../../../interfaces/services.interfaces';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() eventData!: EventI;
  @Output() deleteClick = new EventEmitter();
  @Output() editClick = new EventEmitter();
  show: boolean = false;

  onDelete() {
    this.deleteClick.emit(this.eventData._id);
    // console.log('Delete');
  }

  onEdit() {
    this.show = true;
    this.editClick.emit(this.eventData);
    // console.log(this.show);
  }
}
