import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingDetailsComponent } from './booking-details.component';
import { BookingDataI } from '../../../interfaces/services.interfaces';
import { NgIf, CommonModule } from '@angular/common';

describe('BookingDetailsComponent', () => {
  let component: BookingDetailsComponent;
  let fixture: ComponentFixture<BookingDetailsComponent>;

  const mockBookingData: BookingDataI = {
    _id: 'booking-123',
    eventId: {
      _id: 'event-123',
      title: 'Test Event',
      category: 'Tech',
      totalSeats: 100,
    },
    userId: {
      _id: 'user-123',
      username: 'testuser',
      email: 'testuser@example.com',
    },
    userDetails: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
    },
    priceAtBooking: 1000,
    status: true,
    createdOn: '22nd july, 2025',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsComponent, NgIf, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingDetailsComponent);
    component = fixture.componentInstance;

    component.bookingData = mockBookingData;
    component.showDetailsModal = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Modal Visibility', () => {
    it('should show modal when showDetailsModal is true', () => {
      component.showDetailsModal = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal-overlay');
      expect(modal).toBeTruthy();
    });

    it('should hide modal when showDetailsModal is false', () => {
      component.showDetailsModal = false;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal-overlay');
      expect(modal).toBeNull();
    });
  });

  describe('Data Display', () => {
    it('should display correct event title', () => {
      const titleItem =
        fixture.nativeElement.querySelectorAll('.list-group-item')[0];
      expect(titleItem.textContent).toContain('Event: Test Event');
    });

    it('should display correct username', () => {
      const usernameItem =
        fixture.nativeElement.querySelectorAll('.list-group-item')[1];
      expect(usernameItem.textContent).toContain('Username: testuser');
    });

    it('should display correct full name', () => {
      const fullNameItem =
        fixture.nativeElement.querySelectorAll('.list-group-item')[2];
      expect(fullNameItem.textContent).toContain('Full Name: John Doe');
    });

    it('should display correct email', () => {
      const emailItem =
        fixture.nativeElement.querySelectorAll('.list-group-item')[3];
      expect(emailItem.textContent).toContain('Email: john@example.com');
    });

    it('should display correct phone number', () => {
      const phoneItem =
        fixture.nativeElement.querySelectorAll('.list-group-item')[4];
      expect(phoneItem.textContent).toContain('Phone Number: +1234567890');
    });

    it('should display formatted price', () => {
      const priceItem =
        fixture.nativeElement.querySelectorAll('.list-group-item')[5];
      expect(priceItem.textContent).toContain('Price at Booking: ₦1,000.00');
    });
  });

  describe('Modal Interactions', () => {
    it('should emit close event when close button is clicked', () => {
      spyOn(component.closeDetailsModal, 'emit');

      const closeButton = fixture.nativeElement.querySelector('.btn-danger');
      closeButton.click();

      expect(component.closeDetailsModal.emit).toHaveBeenCalled();
    });

    it('should emit close event when onCloseDetailsModal is called', () => {
      spyOn(component.closeDetailsModal, 'emit');
      component.onCloseDetailsModal();
      expect(component.closeDetailsModal.emit).toHaveBeenCalled();
    });
  });
});
