import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css',
})
export class UserSignupComponent {
  userSignupForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.min(3), Validators.max(30), Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.max(30), Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.min(6), Validators.max(30), Validators.required],
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
      console.log('Form Submitted!', this.userSignupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
