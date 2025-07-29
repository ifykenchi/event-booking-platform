import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UserBookingsComponent } from './user-bookings.component';
import { BookingsService } from '../../../services/bookings.service';
import { NotificationService } from '../../../services/notification.service';
import { BookingDataI } from '../../../interfaces/services.interfaces';
import { RegisterService } from '../../../services/register.service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { BookedCardComponent } from '../../../core/components/booked-card/booked-card.component';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { BookingDetailsComponent } from '../../../core/components/booking-details/booking-details.component';
import { NgFor, NgIf } from '@angular/common';

describe('UserBookingsComponent', () => {
  let component: UserBookingsComponent;
  let fixture: ComponentFixture<UserBookingsComponent>;
  let mockBookingsService: jasmine.SpyObj<BookingsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;

  const mockBooking: BookingDataI = {
    _id: 'booking1',
    eventId: {
      _id: 'event1',
      title: 'Test Event',
      category: 'Tech',
      totalSeats: 100,
    },
    userId: {
      _id: 'user1',
      username: 'testuser',
      email: 'user@test.com',
    },
    userDetails: {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
    },
    status: true,
    priceAtBooking: 1000,
    createdOn: '2023-01-01',
  };

  beforeEach(async () => {
    mockBookingsService = jasmine.createSpyObj('BookingsService', [
      'getUserBookings',
      'cancelBooking',
      'refreshUserBookings',
      'setFilteredBookings',
    ]);
    mockBookingsService.filteredBookings$ = new BehaviorSubject<BookingDataI[]>(
      []
    );

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    mockRegisterService = jasmine.createSpyObj('RegisterService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [
        BookedCardComponent,
        ConfirmationModalComponent,
        BookingDetailsComponent,
        NgFor,
        NgIf,
        UserBookingsComponent,
      ],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: RegisterService, useValue: mockRegisterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBookingsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user bookings on init', fakeAsync(() => {
      const mockUserResponse = {
        message: 'success',
        userData: {
          userId: 'user1',
          username: 'david',
          password: '123456',
        },
      };
      const mockBookingsResponse = {
        message: 'success',
        bookings: [mockBooking],
        availableSeats: 99,
      };

      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      mockBookingsService.getUserBookings.and.returnValue(
        of(mockBookingsResponse)
      );
      (
        mockBookingsService.filteredBookings$ as BehaviorSubject<BookingDataI[]>
      ).next([mockBooking]);

      fixture.detectChanges();
      tick();

      expect(mockRegisterService.getUser).toHaveBeenCalled();
      expect(mockBookingsService.getUserBookings).toHaveBeenCalledWith('user1');
      expect(component.bookings).toEqual([mockBooking]);
    }));

    it('should handle error when loading user fails', fakeAsync(() => {
      const consoleSpy = spyOn(console, 'error');
      mockRegisterService.getUser.and.returnValue(
        throwError(() => new Error('User error'))
      );

      fixture.detectChanges();
      tick();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unauthorized User',
        jasmine.any(Error)
      );
    }));

    it('should handle error when loading bookings fails', fakeAsync(() => {
      const mockUserResponse = {
        message: 'success',
        userData: {
          userId: 'user1',
          username: 'david',
          password: '123456',
        },
      };
      const consoleSpy = spyOn(console, 'error');

      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      mockBookingsService.getUserBookings.and.returnValue(
        throwError(() => new Error('Bookings error'))
      );

      fixture.detectChanges();
      tick();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load bookings',
        jasmine.any(Error)
      );
    }));
  });

  describe('Booking Operations', () => {
    beforeEach(fakeAsync(() => {
      const mockUserResponse = {
        message: 'success',
        userData: {
          userId: 'user1',
          username: 'david',
          password: '123456',
        },
      };
      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      mockBookingsService.getUserBookings.and.returnValue(
        of({ message: 'success', bookings: [mockBooking], availableSeats: 99 })
      );

      fixture.detectChanges();
      tick();
    }));

    it('should open cancel confirmation modal', () => {
      component.handleCancelBooking('booking1');

      expect(component.showConfirmModal).toBeTrue();
      expect(component.targetBookingId).toBe('booking1');
      expect(component.modalType).toBe('cancel booking');
      expect(component.message).toBe(
        'Are you sure you want to cancel your booking?'
      );
    });

    it('should cancel booking when confirmed', fakeAsync(() => {
      component.targetBookingId = 'booking1';
      mockBookingsService.cancelBooking.and.returnValue(
        of({ message: 'success' })
      );

      component.handleConfirmCancelBooking();
      tick();

      expect(mockBookingsService.cancelBooking).toHaveBeenCalledWith(
        'booking1'
      );
      expect(mockBookingsService.refreshUserBookings).toHaveBeenCalledWith(
        'user1'
      );
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Your booking has been cancelled'
      );
      expect(component.showConfirmModal).toBeFalse();
    }));

    it('should handle cancel booking error', fakeAsync(() => {
      const consoleSpy = spyOn(console, 'error');
      component.targetBookingId = 'booking1';
      mockBookingsService.cancelBooking.and.returnValue(
        throwError(() => new Error('Cancel error'))
      );

      component.handleConfirmCancelBooking();
      tick();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to cancel booking',
        jasmine.any(Error)
      );
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Failed to cancel booking'
      );
    }));

    it('should close confirmation modal', () => {
      component.showConfirmModal = true;
      component.handleCloseConfirmModal();

      expect(component.showConfirmModal).toBeFalse();
    });
  });

  describe('Booking Details', () => {
    beforeEach(fakeAsync(() => {
      const mockUserResponse = {
        message: 'success',
        userData: {
          userId: 'user1',
          username: 'david',
          password: '123456',
        },
      };
      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      mockBookingsService.getUserBookings.and.returnValue(
        of({ message: 'success', bookings: [mockBooking], availableSeats: 99 })
      );

      fixture.detectChanges();
      tick();
    }));

    it('should open details modal', () => {
      component.handleOpenDetailsModal(mockBooking);

      expect(component.showDetailsModal).toBeTrue();
      expect(component.userBookingData).toEqual(mockBooking);
    });

    it('should close details modal', () => {
      component.showDetailsModal = true;
      component.handleCloseDetailsModal();

      expect(component.showDetailsModal).toBeFalse();
    });
  });

  describe('UI Rendering', () => {
    beforeEach(fakeAsync(() => {
      const mockUserResponse = {
        message: 'success',
        userData: {
          userId: 'user1',
          username: 'david',
          password: '123456',
        },
      };
      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      mockBookingsService.getUserBookings.and.returnValue(
        of({ message: 'success', bookings: [mockBooking], availableSeats: 99 })
      );

      mockBookingsService.filteredBookings$ = new BehaviorSubject<
        BookingDataI[]
      >([mockBooking]);

      fixture.detectChanges();
      tick();
    }));

    it('should render booked cards', () => {
      fixture.detectChanges();
      const cards = fixture.nativeElement.querySelectorAll('app-booked-card');
      expect(cards.length).toBe(1);
    });
  });
});
