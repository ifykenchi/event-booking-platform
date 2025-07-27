import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsModalComponent } from './events-modal.component';
import { EventI } from '../../../interfaces/services.interfaces';

describe('EventsModalComponent', () => {
  let component: EventsModalComponent;
  let fixture: ComponentFixture<EventsModalComponent>;

  const mockEventData: EventI = {
    _id: 'event-123',
    title: 'Test Event',
    about: 'Test event description',
    totalSeats: 100,
    category: 'Tech',
    price: 1000,
    availableSeats: 75,
    createdOn: '2023-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsModalComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsModalComponent);
    component = fixture.componentInstance;
    component.eventData = mockEventData;
    component.showModal = true;
    (component as any).prefillForm();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should prefill form when eventData is provided', () => {
      expect(component.eventModalForm.value).toEqual({
        title: 'Test Event',
        about: 'Test event description',
        totalSeats: 100,
        category: 'Tech',
        price: 1000,
      });
    });
  });

  describe('Form Validation', () => {
    describe('Title Field', () => {
      it('should validate min length (3)', () => {
        const title = component.eventModalForm.controls.title;
        title.setValue('Te');
        expect(title.errors?.['minlength']).toBeTruthy();
        title.setValue('Test');
        expect(title.errors?.['minlength']).toBeFalsy();
      });

      it('should validate max length (50)', () => {
        const title = component.eventModalForm.controls.title;
        title.setValue('a'.repeat(51));
        expect(title.errors?.['maxlength']).toBeTruthy();
        title.setValue('a'.repeat(50));
        expect(title.errors?.['maxlength']).toBeFalsy();
      });
    });

    describe('About Field', () => {
      it('should validate min length (6)', () => {
        const about = component.eventModalForm.controls.about;
        about.setValue('Short');
        expect(about.errors?.['minlength']).toBeTruthy();
        about.setValue('Long enough');
        expect(about.errors?.['minlength']).toBeFalsy();
      });

      it('should validate max length (3000)', () => {
        const about = component.eventModalForm.controls.about;
        about.setValue('a'.repeat(3001));
        expect(about.errors?.['maxlength']).toBeTruthy();
        about.setValue('a'.repeat(3000));
        expect(about.errors?.['maxlength']).toBeFalsy();
      });
    });

    describe('Total Seats Field', () => {
      it('should validate min value (0)', () => {
        const seats = component.eventModalForm.controls.totalSeats;
        seats.setValue(-1);
        expect(seats.errors?.['min']).toBeTruthy();
        seats.setValue(0);
        expect(seats.errors?.['min']).toBeFalsy();
      });

      it('should validate max value (1,000,000)', () => {
        const seats = component.eventModalForm.controls.totalSeats;
        seats.setValue(1000001);
        expect(seats.errors?.['max']).toBeTruthy();
        seats.setValue(1000000);
        expect(seats.errors?.['max']).toBeFalsy();
      });

      it('should validate integer values', () => {
        const seats = component.eventModalForm.controls.totalSeats;
        seats.setValue(10.5);
        expect(seats.errors?.['notInteger']).toBeTruthy();
        seats.setValue(10);
        expect(seats.errors?.['notInteger']).toBeFalsy();
      });

      it('should accept null/undefined/empty values', () => {
        const seats = component.eventModalForm.controls.totalSeats as any;
        seats.setValue(null);
        expect(seats.errors?.['notInteger']).toBeFalsy();
        seats.setValue(undefined);
        expect(seats.errors?.['notInteger']).toBeFalsy();
        seats.setValue('');
        expect(seats.errors?.['notInteger']).toBeFalsy();
      });
    });

    describe('Category Field', () => {
      it('should be required', () => {
        const category = component.eventModalForm.controls.category;
        category.setValue('');
        expect(category.valid).toBeFalsy();
        category.setValue('Tech');
        expect(category.valid).toBeTruthy();
      });
    });

    describe('Price Field', () => {
      it('should validate min value (0)', () => {
        const price = component.eventModalForm.controls.price;
        price.setValue(-1);
        expect(price.errors?.['min']).toBeTruthy();
        price.setValue(0);
        expect(price.errors?.['min']).toBeFalsy();
      });

      it('should validate max value (100,000,000)', () => {
        const price = component.eventModalForm.controls.price;
        price.setValue(100000001);
        expect(price.errors?.['max']).toBeTruthy();
        price.setValue(100000000);
        expect(price.errors?.['max']).toBeFalsy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should emit updated event when form is valid and submitted', () => {
      spyOn(component.editClick, 'emit');

      component.eventModalForm.setValue({
        title: 'Updated Event',
        about: 'Updated description',
        totalSeats: 150,
        category: 'Entertainment',
        price: 2000,
      });

      component.onSubmit();

      expect(component.editClick.emit).toHaveBeenCalledWith({
        _id: 'event-123',
        title: 'Updated Event',
        about: 'Updated description',
        totalSeats: 150,
        category: 'Entertainment',
        price: 2000,
      });
    });

    it('should not emit when form is invalid', () => {
      spyOn(component.editClick, 'emit');

      component.eventModalForm.setValue({
        title: '',
        about: '',
        totalSeats: -1,
        category: '',
        price: -1,
      });

      component.onSubmit();

      expect(component.editClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Modal Interactions', () => {
    it('should emit close event when closeModal is called', () => {
      spyOn(component.modalClosed, 'emit');
      component.closeModal();
      expect(component.modalClosed.emit).toHaveBeenCalled();
    });

    it('should disable submit button when form is invalid', () => {
      component.eventModalForm.setValue({
        title: '',
        about: '',
        totalSeats: -1,
        category: '',
        price: -1,
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
        about: 'Valid description',
        totalSeats: 100,
        category: 'Tech',
        price: 1000,
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );
      expect(submitButton.disabled).toBeFalsy();
    });
  });

  describe('DOM Interactions', () => {
    it('should show modal when showModal is true', () => {
      component.showModal = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeTruthy();
      expect(modal.style.display).toBe('block');
    });

    it('should hide modal when showModal is false', () => {
      component.showModal = false;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeFalsy();
      expect(modal.style.display).toBe('none');
    });
  });

  describe('ngOnChanges', () => {
    it('should prefill form when eventData changes', () => {
      const newEventData: EventI = {
        _id: 'event-456',
        title: 'New Event',
        about: 'New description',
        totalSeats: 200,
        category: 'Football',
        price: 1500,
        availableSeats: 200,
        createdOn: '2023-02-01',
      };

      component.eventData = newEventData;
      component.ngOnChanges({
        eventData: {
          currentValue: newEventData,
          previousValue: mockEventData,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.eventModalForm.value).toEqual({
        title: 'New Event',
        about: 'New description',
        totalSeats: 200,
        category: 'Football',
        price: 1500,
      });
    });

    it('should prefill form when showModal becomes true', () => {
      component.showModal = false;
      fixture.detectChanges();

      component.showModal = true;
      component.ngOnChanges({
        showModal: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.eventModalForm.value).toEqual({
        title: 'Test Event',
        about: 'Test event description',
        totalSeats: 100,
        category: 'Tech',
        price: 1000,
      });
    });
  });
});
