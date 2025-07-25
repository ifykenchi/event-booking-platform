import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BookEventModalComponent } from './book-event-modal.component';

describe('BookEventModalComponent', () => {
  let component: BookEventModalComponent;
  let fixture: ComponentFixture<BookEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookEventModalComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BookEventModalComponent);
    component = fixture.componentInstance;

    // Set required input properties
    component.showBookingModal = true;
    component.eventId = 'event-123';
    component.userId = 'user-456';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.bookingModalForm.value).toEqual({
        fullName: '',
        email: '',
        phoneNumber: '',
      });
    });
  });

  describe('Form Validation', () => {
    describe('fullName', () => {
      it('should be required', () => {
        const control = component.fullName;
        expect(control.valid).toBeFalsy();
        control.setValue('John Doe');
        expect(control.valid).toBeTruthy();
      });

      it('should validate min length (3)', () => {
        const control = component.fullName;
        control.setValue('Jo');
        expect(control.errors?.['minlength']).toBeTruthy();
        control.setValue('Joh');
        expect(control.errors?.['minlength']).toBeFalsy();
      });

      it('should validate max length (100)', () => {
        const control = component.fullName;
        control.setValue('a'.repeat(101));
        expect(control.errors?.['maxlength']).toBeTruthy();
        control.setValue('a'.repeat(100));
        expect(control.errors?.['maxlength']).toBeFalsy();
      });
    });

    describe('email', () => {
      it('should be required', () => {
        const control = component.email;
        expect(control.valid).toBeFalsy();
        control.setValue('test@example.com');
        expect(control.valid).toBeTruthy();
      });

      it('should validate email format', () => {
        const control = component.email;
        control.setValue('invalid-email');
        expect(control.errors?.['email']).toBeTruthy();
        control.setValue('valid@example.com');
        expect(control.errors?.['email']).toBeFalsy();
      });

      it('should validate max length (254)', () => {
        const control = component.email;
        control.setValue('a'.repeat(255) + '@example.com');
        expect(control.errors?.['maxlength']).toBeTruthy();
        control.setValue('a'.repeat(242) + '@example.com');
        expect(control.errors?.['maxlength']).toBeFalsy();
      });
    });

    describe('phoneNumber', () => {
      it('should be required', () => {
        const control = component.phoneNumber;
        expect(control.valid).toBeFalsy();
        control.setValue('+1234567890');
        expect(control.valid).toBeTruthy();
      });

      it('should validate phone pattern', () => {
        const control = component.phoneNumber;

        control.setValue('123');
        expect(control.errors?.['pattern']).toBeTruthy();

        control.setValue('+123456789012345678901');
        expect(control.errors?.['pattern']).toBeTruthy();

        control.setValue('abc123');
        expect(control.errors?.['pattern']).toBeTruthy();

        control.setValue('+1234567890');
        expect(control.errors?.['pattern']).toBeFalsy();

        control.setValue('1234567890');
        expect(control.errors?.['pattern']).toBeFalsy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should emit bookClick event with correct data when form is valid', () => {
      spyOn(component.bookClick, 'emit');

      component.bookingModalForm.setValue({
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
      });

      component.onSubmit();

      expect(component.bookClick.emit).toHaveBeenCalledWith({
        eventId: 'event-123',
        userId: 'user-456',
        userDetails: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
        },
      });
    });

    it('should not emit when form is invalid', () => {
      spyOn(component.bookClick, 'emit');

      component.bookingModalForm.setValue({
        fullName: '',
        email: 'invalid-email',
        phoneNumber: '123',
      });

      component.onSubmit();

      expect(component.bookClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Modal Interactions', () => {
    it('should emit closeBookingModal when closeModal is called', () => {
      spyOn(component.closeBookingModal, 'emit');
      component.closeModal();
      expect(component.closeBookingModal.emit).toHaveBeenCalled();
    });

    it('should disable submit button when form is invalid', () => {
      component.bookingModalForm.setValue({
        fullName: '',
        email: '',
        phoneNumber: '',
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.bookingModalForm.setValue({
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeFalsy();
    });
  });

  describe('DOM Interactions', () => {
    it('should show validation messages when fields are invalid and dirty', () => {
      const control = component.fullName;
      control.setValue('');
      control.markAsDirty();
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('.alert-danger');
      expect(errorMessage.textContent).toContain('fullName is required');
    });

    it('should show modal when showBookingModal is true', () => {
      component.showBookingModal = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeTruthy();
      expect(modal.style.display).toBe('block');
    });

    it('should hide modal when showBookingModal is false', () => {
      component.showBookingModal = false;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeFalsy();
      expect(modal.style.display).toBe('none');
    });
  });
});
