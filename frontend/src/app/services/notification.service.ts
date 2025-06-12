import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title = 'Success') {
    this.toastr.success(message, title);
  }

  showError(message: string, title = 'Error') {
    this.toastr.error(message, title);
  }
}
