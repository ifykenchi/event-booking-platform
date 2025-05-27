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
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  constructor(private registerService: RegisterService) {}

  adminLoginForm = new FormGroup({
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
    return this.adminLoginForm.controls.username;
  }
  get email() {
    return this.adminLoginForm.controls.email;
  }
  get password() {
    return this.adminLoginForm.controls.password;
  }

  onSubmit() {
    if (this.adminLoginForm.valid) {
      const newAdmin = this.adminLoginForm.value as signupPost;
      this.registerService.adminLogin(newAdmin).subscribe({
        next: (res) => console.log('Success!', res),
        error: (err) => console.error('Error!', err),
      });
      this.adminLoginForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
