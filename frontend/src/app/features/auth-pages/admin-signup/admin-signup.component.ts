import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { signupPost } from '../../../interfaces/services.interfaces';
import { RegisterService } from '../../../services/register.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.css',
})
export class AdminSignupComponent {
  constructor(
    private registerService: RegisterService,
    private notification: NotificationService,
    private router: Router
  ) {}

  adminSignupForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required,
      ],
    }),
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

  get username() {
    return this.adminSignupForm.controls.username;
  }

  get email() {
    return this.adminSignupForm.controls.email;
  }

  get password() {
    return this.adminSignupForm.controls.password;
  }

  onSubmit() {
    if (this.adminSignupForm.valid) {
      const newAdmin = this.adminSignupForm.value as signupPost;
      this.registerService.adminSignup(newAdmin).subscribe({
        next: (res) => {
          console.log('Success!', res);
          this.router.navigate(['/admin/dashboard']);
          this.notification.showSuccess('You are Signed Up!');
        },
        error: (err) => {
          console.error('Error!', err);
          this.notification.showError(err.error.error || 'signup failed');
        },
      });
      this.adminSignupForm.reset();
    } else {
      console.log('Form is invalid');
      this.notification.showError('Invalid Credentials. Please try again.');
    }
  }
}
