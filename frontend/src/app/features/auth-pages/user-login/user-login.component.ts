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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent {
  constructor(private registerService: RegisterService) {}

  userLoginForm = new FormGroup({
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
    return this.userLoginForm.controls.email;
  }
  get password() {
    return this.userLoginForm.controls.password;
  }

  onSubmit() {
    if (this.userLoginForm.valid) {
      const newUser = this.userLoginForm.value as loginPost;
      this.registerService.userLogin(newUser).subscribe({
        next: (res) => console.log('Success!', res),
        error: (err) => console.error('Error!', err),
      });
      this.userLoginForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
