import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.css',
})
export class AdminSignupComponent {
  adminSignupForm = new FormGroup({
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
      console.log('Form Submitted!', this.adminSignupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
