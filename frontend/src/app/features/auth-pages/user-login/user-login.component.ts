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
  selector: 'app-user-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent {
  constructor(
    private registerService: RegisterService,
    private router: Router,
    private notification: NotificationService
  ) {}

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
        next: (res) => {
          console.log('Success!', res);
          this.router.navigate(['/user/dashboard']);
          this.notification.showSuccess('Logged In');
        },
        error: (err) => {
          console.error('Error!', err);
          this.notification.showError('An error occured. Please try again.');
        },
      });
      this.userLoginForm.reset();
    } else {
      console.log('Form is invalid');
      this.notification.showError('Invalid email or password');
    }
  }
}
