import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBookingsComponent } from './admin-bookings.component';
import { BookingsService } from '../../../services/bookings.service';
import { NotificationService } from '../../../services/notification.service';
import { BookingDataI } from '../../../interfaces/services.interfaces';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { NgFor, NgIf } from '@angular/common';

describe('AdminBookingsComponent', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;
  let mockBookingsService: jasmine.SpyObj<BookingsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

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
      email: 'admin@gmail.com',
    },
    userDetails: {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
    },
    status: true,
    priceAtBooking: 1000,
    createdOn: '12th nov, 2025',
  };

  beforeEach(async () => {
    mockBookingsService = jasmine.createSpyObj('BookingsService', [
      'getAllBookings',
      'deleteBooking',
      'refreshAdminBookings',
      'setFilteredBookings',
      'filteredBookings$',
    ]);
    mockBookingsService.filteredBookings$ = new BehaviorSubject<BookingDataI[]>(
      []
    );

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        NgFor,
        NgIf,
        ConfirmationModalComponent,
        AdminBookingsComponent,
      ],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load bookings on init', async () => {
      const mockResponse = {
        message: 'success',
        bookings: [mockBooking],
        availableSeats: 99,
      };

      mockBookingsService.getAllBookings.and.returnValue(of(mockResponse));
      (
        mockBookingsService.filteredBookings$ as BehaviorSubject<BookingDataI[]>
      ).next([mockBooking]);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockBookingsService.getAllBookings).toHaveBeenCalled();
      expect(component.bookings).toEqual([mockBooking]);
    });

    it('should handle error when loading bookings fails', () => {
      const consoleSpy = spyOn(console, 'error');
      mockBookingsService.getAllBookings.and.returnValue(
        throwError(() => new Error('Load error'))
      );
      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load bookings',
        jasmine.any(Error)
      );
    });
  });

  describe('Booking Deletion', () => {
    it('should set up confirmation modal when delete is clicked', () => {
      component.handleDeleteBooking('booking1');

      expect(component.showConfirmModal).toBeTrue();
      expect(component.targetBookingId).toBe('booking1');
      expect(component.modalType).toBe('delete booking');
      expect(component.message).toBe(
        'this is irreversible. Are you sure you want to delete?'
      );
    });

    it('should close confirmation modal', () => {
      component.handleCloseConfirmModal();

      expect(component.showConfirmModal).toBeFalse();
    });

    it('should delete booking when confirmed', () => {
      mockBookingsService.deleteBooking.and.returnValue(
        of({ message: 'success' })
      );
      component.targetBookingId = 'booking1';

      component.handleConfirmDeleteBooking();

      expect(mockBookingsService.deleteBooking).toHaveBeenCalledWith(
        'booking1'
      );
      expect(mockBookingsService.refreshAdminBookings).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'the booking has been deleted'
      );
      expect(component.showConfirmModal).toBeFalse();
    });

    it('should handle error when deletion fails', () => {
      const consoleSpy = spyOn(console, 'error');
      mockBookingsService.deleteBooking.and.returnValue(
        throwError(() => new Error('Delete error'))
      );
      component.targetBookingId = 'booking1';

      component.handleConfirmDeleteBooking();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to delete booking',
        jasmine.any(Error)
      );
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Failed to delete booking'
      );
    });
  });
});
