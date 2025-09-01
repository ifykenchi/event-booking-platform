import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEventsComponent } from './view-events.component';
import { EventsService } from '../../../services/events.service';
import { RegisterService } from '../../../services/register.service';
import { BookingsService } from '../../../services/bookings.service';
import { NotificationService } from '../../../services/notification.service';
import { of, throwError } from 'rxjs';
import { EventI, BookingI } from '../../../interfaces/services.interfaces';

describe('ViewEventsComponent', () => {
  let component: ViewEventsComponent;
  let fixture: ComponentFixture<ViewEventsComponent>;
  let mockEventsService: jasmine.SpyObj<EventsService>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let mockBookingsService: jasmine.SpyObj<BookingsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockEvents: EventI[] = [
    {
      _id: '1',
      title: 'Event 1',
      about: 'Description 1',
      totalSeats: 100,
      category: 'Tech',
      price: 1000,
      createdOn: '12th nov, 2025',
    },
    {
      _id: '2',
      title: 'Event 2',
      about: 'Description 2',
      totalSeats: 200,
      category: 'Tech',
      price: 1000,
      createdOn: '12th nov, 2025',
    },
  ];

  const mockUser = {
    userData: { userId: 'user123', username: 'john', password: '123456' },
  };
  const mockBooking: BookingI = {
    _id: 'booking123',
    eventId: 'event123',
    userId: 'user123',
    userDetails: {
      fullName: 'charles goon',
      email: 'charles@example.com',
      phoneNumber: '1234567890',
    },
    status: true,
    priceAtBooking: 1000,
    createdOn: '12th nov, 2025',
  };

  beforeEach(async () => {
    mockEventsService = jasmine.createSpyObj('EventsService', [
      'getUserEvents',
      'refreshUserEvents',
      'filteredEvents$',
    ]);

    mockRegisterService = jasmine.createSpyObj('RegisterService', ['getUser']);

    mockBookingsService = jasmine.createSpyObj('BookingsService', [
      'addBooking',
    ]);

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [ViewEventsComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEventsComponent);
    component = fixture.componentInstance;

    mockEventsService.getUserEvents.and.returnValue(
      of({ message: 'success', events: mockEvents })
    );
    mockRegisterService.getUser.and.returnValue(
      of({
        message: 'success',
        userData: mockUser.userData,
      })
    );
    mockEventsService.filteredEvents$ = of(mockEvents);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load events and user data on initialization', () => {
      expect(mockEventsService.getUserEvents).toHaveBeenCalled();
      expect(mockRegisterService.getUser).toHaveBeenCalled();
      expect(component.events).toEqual(mockEvents);
      expect(component.userId).toBe(mockUser.userData.userId);
    });

    it('should log error when events fail to load', () => {
      const errorMessage = 'Failed to load events!';
      const mockError = new Error('Test error');
      spyOn(console, 'error');

      mockEventsService.getUserEvents.and.returnValue(
        throwError(() => mockError)
      );
      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith(errorMessage, mockError);
    });

    it('should log error when user data fails to load', () => {
      const errorMessage = 'Unauthorized User';
      const mockError = new Error('Auth error');
      spyOn(console, 'error');

      mockRegisterService.getUser.and.returnValue(throwError(() => mockError));
      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith(errorMessage, mockError);
    });

    it('should update events when filteredEvents$ emits', () => {
      const newEvents = [mockEvents[0]];
      mockEventsService.filteredEvents$ = of(newEvents);

      component.ngOnInit();

      expect(component.events).toEqual(newEvents);
    });
  });

  describe('Booking Modal', () => {
    it('should open booking modal with event ID', () => {
      const eventId = '123';
      component.showBookModal(eventId);

      expect(component.showModal).toBeTrue();
      expect(component.eventId).toBe(eventId);
    });

    it('should close booking modal', () => {
      component.showModal = true;
      component.handleCloseBookingModal();

      expect(component.showModal).toBeFalse();
    });
  });

  describe('handleBookEvent', () => {
    it('should book event successfully', () => {
      mockBookingsService.addBooking.and.returnValue(
        of({
          message: 'success',
          bookings: [mockBooking as any],
          availableSeats: 99,
        })
      );

      component.handleBookEvent(mockBooking);

      expect(mockBookingsService.addBooking).toHaveBeenCalledWith(mockBooking);
      expect(mockEventsService.refreshUserEvents).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Event has been Booked'
      );
      expect(component.showModal).toBeFalse();
    });

    it('should handle booking error', () => {
      const error = { error: { error: 'Booking failed' } };
      mockBookingsService.addBooking.and.returnValue(throwError(() => error));

      component.handleBookEvent(mockBooking);

      expect(mockBookingsService.addBooking).toHaveBeenCalledWith(mockBooking);
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        error.error.error
      );
    });

    it('should not book if booking data is empty', () => {
      spyOn(console, 'error');

      component.handleBookEvent(null as any);

      expect(console.error).toHaveBeenCalledWith(
        'Submitted Booking cannot be empty'
      );
      expect(mockBookingsService.addBooking).not.toHaveBeenCalled();
    });
  });
});
