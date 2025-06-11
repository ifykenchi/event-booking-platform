import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventI } from '../../../interfaces/services.interfaces';
import { NgIf } from '@angular/common';
import { LocalStorageService } from '../../../services/localStorage.service';

@Component({
  selector: 'app-card',
  imports: [NgIf],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() eventData!: EventI;
  @Output() deleteClick = new EventEmitter();
  @Output() editClick = new EventEmitter();
  show: boolean = false;
  isAdmin: boolean = false;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.isAdmin = this.localStorageService.isAdmin();
  }

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
