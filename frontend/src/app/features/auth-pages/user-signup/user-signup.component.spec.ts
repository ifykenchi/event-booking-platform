import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSignupComponent } from './user-signup.component';
import { RegisterService } from '../../../services/register.service';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserSignupComponent', () => {
  let component: UserSignupComponent;
  let fixture: ComponentFixture<UserSignupComponent>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    mockRegisterService = jasmine.createSpyObj('RegisterService', [
      'userSignup',
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        UserSignupComponent,
      ],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize form with empty values', () => {
      expect(component.userSignupForm.value).toEqual({
        username: '',
        email: '',
        password: '',
      });
    });

    it('should validate username field', () => {
      const username = component.userSignupForm.controls.username;

      username.setValue('');
      expect(username.hasError('required')).toBeTrue();

      username.setValue('ab');
      expect(username.hasError('minlength')).toBeTrue();

      username.setValue('a'.repeat(31));
      expect(username.hasError('maxlength')).toBeTrue();

      username.setValue('validusername');
      expect(username.valid).toBeTrue();
    });

    it('should validate email field', () => {
      const email = component.userSignupForm.controls.email;

      email.setValue('');
      expect(email.hasError('required')).toBeTrue();

      email.setValue('invalid-email');
      expect(email.hasError('email')).toBeTrue();

      email.setValue('a'.repeat(31) + '@test.com');
      expect(email.hasError('maxlength')).toBeTrue();

      email.setValue('valid@test.com');
      expect(email.valid).toBeTrue();
    });

    it('should validate password field', () => {
      const password = component.userSignupForm.controls.password;

      password.setValue('');
      expect(password.hasError('required')).toBeTrue();

      password.setValue('12345');
      expect(password.hasError('minlength')).toBeTrue();

      password.setValue('a'.repeat(31));
      expect(password.hasError('maxlength')).toBeTrue();

      password.setValue('validpassword');
      expect(password.valid).toBeTrue();
    });
  });

  describe('onSubmit()', () => {
    const validFormData = {
      username: 'testadmin',
      email: 'user@test.com',
      password: 'validpassword',
    };

    it('should not call signup service when form is invalid', () => {
      component.userSignupForm.setValue({
        username: '',
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(mockRegisterService.userSignup).not.toHaveBeenCalled();
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Invalid Credentials. Please try again.'
      );
    });

    it('should call signup service when form is valid', () => {
      component.userSignupForm.setValue(validFormData);
      mockRegisterService.userSignup.and.returnValue(of({}));

      component.onSubmit();

      expect(mockRegisterService.userSignup).toHaveBeenCalledWith(
        validFormData
      );
    });

    it('should handle successful signup', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.userSignupForm.setValue(validFormData);
      mockRegisterService.userSignup.and.returnValue(
        of({ accessToken: 'test-token' })
      );

      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['/user/dashboard']);
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'You are Signed Up!'
      );
      expect(component.userSignupForm.value).toEqual({
        username: '',
        email: '',
        password: '',
      });
    });

    it('should handle signup error with specific message', () => {
      const errorResponse = { error: { error: 'Email already exists' } };
      component.userSignupForm.setValue(validFormData);
      mockRegisterService.userSignup.and.returnValue(
        throwError(() => errorResponse)
      );

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Email already exists'
      );
    });
  });

  describe('UI Interactions', () => {
    it('should disable submit button when form is invalid', () => {
      component.userSignupForm.setValue({
        username: '',
        email: '',
        password: '',
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.userSignupForm.setValue({
        username: 'testadmin',
        email: 'user@test.com',
        password: 'validpassword',
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeFalse();
    });

    it('should show validation messages when fields are invalid and touched', () => {
      const emailControl = component.userSignupForm.controls.email;
      emailControl.setValue('');
      emailControl.markAsTouched();
      fixture.detectChanges();

      const errorMessages =
        fixture.nativeElement.querySelectorAll('.alert-danger');
      expect(errorMessages.length).toBe(1);
      expect(errorMessages[0].textContent).toContain('Email is required');
    });
  });
});
