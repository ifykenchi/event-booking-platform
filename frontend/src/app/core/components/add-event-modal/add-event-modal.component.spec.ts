import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AddEventModalComponent } from './add-event-modal.component';

describe('AddEventModalComponent', () => {
  let component: AddEventModalComponent;
  let fixture: ComponentFixture<AddEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventModalComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventModalComponent);
    component = fixture.componentInstance;
    component.showAddModal = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize form with empty values', () => {
      expect(component.eventModalForm.value).toEqual({
        title: '',
        about: '',
        totalSeats: 0,
        category: '',
        price: 0,
      });
    });

    it('should make title required', () => {
      const title = component.eventModalForm.controls.title;
      expect(title.valid).toBeFalsy();
      title.setValue('Test Event');
      expect(title.valid).toBeTruthy();
    });

    it('should validate title min length', () => {
      const title = component.eventModalForm.controls.title;
      title.setValue('Te');
      expect(title.errors?.['minlength']).toBeTruthy();
      title.setValue('Test');
      expect(title.errors?.['minlength']).toBeFalsy();
    });

    it('should validate title max length', () => {
      const title = component.eventModalForm.controls.title;
      title.setValue('a'.repeat(51));
      expect(title.errors?.['maxlength']).toBeTruthy();
      title.setValue('a'.repeat(50));
      expect(title.errors?.['maxlength']).toBeFalsy();
    });

    it('should validate about min length', () => {
      const about = component.eventModalForm.controls.about;
      about.setValue('Short');
      expect(about.errors?.['minlength']).toBeTruthy();
      about.setValue('Long enough description');
      expect(about.errors?.['minlength']).toBeFalsy();
    });

    it('should validate totalSeats as integer', () => {
      const seats = component.eventModalForm.controls.totalSeats;
      seats.setValue(10.5);
      expect(seats.errors?.['notInteger']).toBeTruthy();
      seats.setValue(10);
      expect(seats.errors?.['notInteger']).toBeFalsy();
    });

    it('should validate totalSeats min value', () => {
      const seats = component.eventModalForm.controls.totalSeats;
      seats.setValue(-1);
      expect(seats.errors?.['min']).toBeTruthy();
      seats.setValue(0);
      expect(seats.errors?.['min']).toBeFalsy();
    });

    it('should validate price max value', () => {
      const price = component.eventModalForm.controls.price;
      price.setValue(1000000001);
      expect(price.errors?.['max']).toBeTruthy();
      price.setValue(1000000000);
      expect(price.errors?.['max']).toBeFalsy();
    });

    it('should require category selection', () => {
      const category = component.eventModalForm.controls.category;
      expect(category.valid).toBeFalsy();
      category.setValue('Tech');
      expect(category.valid).toBeTruthy();
    });

    it('should return null for empty/null/undefined values in integerValidator', () => {
      const validatorFn = (component as any).integerValidator();
      const control = new FormControl();

      control.setValue(null);
      expect(validatorFn(control)).toBeNull();

      control.setValue(undefined);
      expect(validatorFn(control)).toBeNull();

      control.setValue('');
      expect(validatorFn(control)).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('should emit event when form is valid and submitted', () => {
      spyOn(component.addClick, 'emit');

      component.eventModalForm.setValue({
        title: 'Test Event',
        about: 'This is a test event description',
        totalSeats: 100,
        category: 'Tech',
        price: 50,
      });

      component.onSubmit();

      expect(component.addClick.emit).toHaveBeenCalledWith({
        title: 'Test Event',
        about: 'This is a test event description',
        totalSeats: 100,
        category: 'Tech',
        price: 50,
      });
    });

    it('should not emit event when form is invalid', () => {
      spyOn(component.addClick, 'emit');

      component.eventModalForm.setValue({
        title: '',
        about: 'Valid',
        totalSeats: 100,
        category: 'Tech',
        price: 50,
      });

      component.onSubmit();

      expect(component.addClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Modal Interactions', () => {
    it('should emit close event when closeModal is called', () => {
      spyOn(component.closeAddModal, 'emit');
      component.closeModal();
      expect(component.closeAddModal.emit).toHaveBeenCalled();
    });

    it('should disable submit button when form is invalid', () => {
      component.eventModalForm.setValue({
        title: '',
        about: 'Valid about',
        totalSeats: 100,
        category: 'Tech',
        price: 50,
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.eventModalForm.setValue({
        title: 'Valid',
        about: 'Valid about',
        totalSeats: 100,
        category: 'Tech',
        price: 50,
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
      const titleControl = component.eventModalForm.controls.title;
      titleControl.setValue('');
      titleControl.markAsDirty();
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('.alert-danger');
      expect(errorMessage.textContent).toContain('Title is Required');
    });

    it('should show modal when showAddModal is true', () => {
      component.showAddModal = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeTruthy();
      expect(modal.style.display).toBe('block');
    });

    it('should hide modal when showAddModal is false', () => {
      component.showAddModal = false;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeFalsy();
      expect(modal.style.display).toBe('none');
    });
  });
});
