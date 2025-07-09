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
  selector: 'app-user-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css',
})
export class UserSignupComponent {
  constructor(
    private registerService: RegisterService,
    private notification: NotificationService,
    private router: Router
  ) {}

  userSignupForm = new FormGroup({
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
    return this.userSignupForm.controls.username;
  }

  get email() {
    return this.userSignupForm.controls.email;
  }

  get password() {
    return this.userSignupForm.controls.password;
  }

  onSubmit() {
    if (this.userSignupForm.valid) {
      const newUser = this.userSignupForm.value as signupPost;
      this.registerService.userSignup(newUser).subscribe({
        next: (res) => {
          console.log('Success!', res);
          this.router.navigate(['/user/dashboard']);
          this.notification.showSuccess('You are Signed Up!');
        },
        error: (err) => {
          console.error('Error!', err);
          this.notification.showError(err.error.error || 'signup failed');
        },
      });
      this.userSignupForm.reset();
    } else {
      console.log('Form is invalid');
      this.notification.showError('Invalid Credentials. Please try again.');
    }
  }
}
