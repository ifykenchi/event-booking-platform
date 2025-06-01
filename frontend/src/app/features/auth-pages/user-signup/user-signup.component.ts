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

@Component({
  selector: 'app-user-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css',
})
export class UserSignupComponent {
  constructor(private registerService: RegisterService) {}

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
        next: (res) => console.log('Success!', res),
        error: (err) => console.error('Error!', err),
      });
      // console.log('Form Submitted!', newUser);
      // next: (res) => this.router.navigate(['/dashboard']),
      this.userSignupForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
