import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLoginComponent } from './admin-login.component';
import { RegisterService } from '../../../services/register.service';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    mockRegisterService = jasmine.createSpyObj('RegisterService', [
      'adminLogin',
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AdminLoginComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
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
      expect(component.adminLoginForm.value).toEqual({
        email: '',
        password: '',
      });
    });

    it('should validate email field', () => {
      const email = component.adminLoginForm.controls.email;

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
      const password = component.adminLoginForm.controls.password;

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
      email: 'admin@test.com',
      password: 'validpassword',
    };

    it('should not call login service when form is invalid', () => {
      component.adminLoginForm.setValue({
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(mockRegisterService.adminLogin).not.toHaveBeenCalled();
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Invalid email or password'
      );
    });

    it('should call login service when form is valid', () => {
      component.adminLoginForm.setValue(validFormData);
      mockRegisterService.adminLogin.and.returnValue(of({}));

      component.onSubmit();

      expect(mockRegisterService.adminLogin).toHaveBeenCalledWith(
        validFormData
      );
    });

    it('should handle successful login', () => {
      component.adminLoginForm.setValue(validFormData);
      mockRegisterService.adminLogin.and.returnValue(
        of({ adminToken: 'test-token' })
      );
      const navigateSpy = spyOn(router, 'navigate');

      component.onSubmit();

      expect(mockRegisterService.adminLogin).toHaveBeenCalledWith(
        validFormData
      );
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Logged In'
      );
      expect(component.adminLoginForm.value).toEqual({
        email: '',
        password: '',
      });
    });

    it('should handle login error', () => {
      const errorResponse = { error: { error: 'Invalid credentials' } };
      component.adminLoginForm.setValue(validFormData);
      mockRegisterService.adminLogin.and.returnValue(
        throwError(() => errorResponse)
      );
      const navigateSpy = spyOn(router, 'navigate');

      component.onSubmit();

      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Invalid credentials'
      );
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('UI Interactions', () => {
    it('should disable submit button when form is invalid', () => {
      component.adminLoginForm.setValue({
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
      component.adminLoginForm.setValue({
        email: 'admin@test.com',
        password: 'validpassword',
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeFalse();
    });

    it('should show validation messages when fields are invalid and touched', () => {
      const emailControl = component.adminLoginForm.controls.email;
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
