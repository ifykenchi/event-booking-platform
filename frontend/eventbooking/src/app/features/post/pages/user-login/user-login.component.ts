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
  selector: 'app-user-login',
  imports: [ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent {
  constructor(private registerService: RegisterService) {}

  userLoginForm = new FormGroup({
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
    return this.userLoginForm.controls.username;
  }
  get email() {
    return this.userLoginForm.controls.email;
  }
  get password() {
    return this.userLoginForm.controls.password;
  }

  onSubmit() {
    if (this.userLoginForm.valid) {
      const newUser = this.userLoginForm.value as signupPost;
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
