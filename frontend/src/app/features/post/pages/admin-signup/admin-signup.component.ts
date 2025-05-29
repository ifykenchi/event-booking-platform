import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { signupPost } from '../../../../../interfaces/services.interfaces';
import { RegisterService } from '../../../../services/register.service';

@Component({
  selector: 'app-admin-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.css',
})
export class AdminSignupComponent {
  constructor(private registerService: RegisterService) {}
  // constructor() {}
  // ngOnInit() {}

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
        next: (res) => console.log('Success!', res),
        error: (err) => console.error('Error!', err),
      });
      // console.log('Form Submitted!', newAdmin);
      // next: (res) => this.router.navigate(['/dashboard']),
      this.adminSignupForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
