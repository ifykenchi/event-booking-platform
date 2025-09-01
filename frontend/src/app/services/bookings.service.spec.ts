import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookingsService } from './bookings.service';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';
import {
  BookingI,
  BookingDataI,
  bookingsResponseI,
  CancelBookingI,
  DeleteI,
} from '../interfaces/services.interfaces';
import { BehaviorSubject, of } from 'rxjs';

describe('BookingsService', () => {
  let service: BookingsService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

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

  const mockBookingsResponse: bookingsResponseI = {
    message: 'success',
    bookings: [mockBooking],
    availableSeats: 99,
  };

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
      'setItem',
      'removeItem',
      'isLoggedIn',
      'isAdmin',
      'clear',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BookingsService,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    });

    service = TestBed.inject(BookingsService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      localStorageService.getItem.and.returnValue('test-token');
    });

    it('should get all bookings (admin)', () => {
      service.getAllBookings().subscribe((res) => {
        expect(res).toEqual(mockBookingsResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/admin/bookings`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockBookingsResponse);
    });

    it('should get user bookings', () => {
      const userId = 'user1';
      service.getUserBookings(userId).subscribe((res) => {
        expect(res).toEqual(mockBookingsResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/user/bookings/${userId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockBookingsResponse);
    });

    it('should add a booking', () => {
      const newBooking: BookingI = {
        _id: 'booking2',
        eventId: 'event123',
        userId: 'user123',
        userDetails: {
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '1234567890',
        },
        status: true,
        priceAtBooking: 1000,
        createdOn: '12th nov, 2025',
      };

      service.addBooking(newBooking).subscribe((res) => {
        expect(res).toEqual(mockBookingsResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/user/booking`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBooking);
      req.flush(mockBookingsResponse);
    });

    it('should cancel a booking', () => {
      const bookingId = '1';
      const mockResponse: CancelBookingI = { message: 'Cancelled' };

      service.cancelBooking(bookingId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/user/booking/${bookingId}`
      );
      expect(req.request.method).toBe('PATCH');
      req.flush(mockResponse);
    });

    it('should delete a booking (admin)', () => {
      const bookingId = '1';
      const mockResponse: DeleteI = { message: 'Deleted' };

      service.deleteBooking(bookingId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/booking/${bookingId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('Token Handling', () => {
    it('should throw error when no user token', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.getUserBookings('user1').subscribe();
      }).toThrowError('Token not found');
    });

    it('should throw error when no admin token', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.getAllBookings().subscribe();
      }).toThrowError('No access token found');
    });
  });

  describe('BehaviorSubject Management', () => {
    it('should update filtered bookings', () => {
      const testBookings: BookingDataI[] = [
        {
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
        },
      ];

      service.setFilteredBookings(testBookings);
      service.filteredBookings$.subscribe((bookings) => {
        expect(bookings).toEqual(testBookings);
      });
    });

    it('should refresh admin bookings', () => {
      spyOn(service, 'getAllBookings').and.returnValue(
        of(mockBookingsResponse)
      );

      service.refreshAdminBookings();

      service.filteredBookings$.subscribe((bookings) => {
        expect(bookings).toEqual(mockBookingsResponse.bookings);
      });
    });

    it('should refresh user bookings', () => {
      const userId = 'user1';
      spyOn(service, 'getUserBookings').and.returnValue(
        of(mockBookingsResponse)
      );

      service.refreshUserBookings(userId);

      service.filteredBookings$.subscribe((bookings) => {
        expect(bookings).toEqual(mockBookingsResponse.bookings);
      });
    });
  });
});
