import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { loginPost } from '../../../interfaces/services.interfaces';
import { RegisterService } from '../../../services/register.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  constructor(
    private registerService: RegisterService,
    private router: Router,
    private notification: NotificationService
  ) {}

  adminLoginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.email,
        Validators.maxLength(30),
        Validators.required,
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.required,
      ],
    }),
  });

  get email() {
    return this.adminLoginForm.controls.email;
  }
  get password() {
    return this.adminLoginForm.controls.password;
  }

  onSubmit() {
    if (this.adminLoginForm.valid) {
      const newAdmin = this.adminLoginForm.value as loginPost;
      this.registerService.adminLogin(newAdmin).subscribe({
        next: (res) => {
          console.log('Success!', res);
          this.router.navigate(['/admin/dashboard']);
          this.notification.showSuccess('Logged In');
        },
        error: (err) => {
          console.error('Error!', err);
          this.notification.showError('An error occured. Please try again.');
        },
      });
      this.adminLoginForm.reset();
    } else {
      console.log('Form is invalid');
      this.notification.showError('Invalid email or password');
    }
  }
}
