import { ViewEventsComponent } from './view-events.component';
import { EventsService } from '../../../services/events.service';
import { RegisterService } from '../../../services/register.service';
import { BookingsService } from '../../../services/bookings.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import { CardComponent } from '../../../core/components/card/card.component';
import { BookEventModalComponent } from '../../../core/components/book-event-modal/book-event-modal.component';
import { of, throwError } from 'rxjs';

describe('ViewEventsComponent', () => {
  const mockEvent = {
    _id: 'event123',
    title: 'Test Event',
    about: 'Test event description',
    totalSeats: 100,
    availableSeats: 80,
    category: 'Tech',
    price: 1000,
    createdOn: '2023-01-01',
  };

  const mockUser = {
    userData: {
      userId: 'user123',
      username: 'testuser',
      email: 'test@example.com',
    },
  };

  let mockEventsService: {
    getUserEvents: Cypress.Agent<sinon.SinonStub>;
    refreshUserEvents: Cypress.Agent<sinon.SinonStub>;
    filteredEvents$: any;
  };

  let mockRegisterService: {
    getUser: Cypress.Agent<sinon.SinonStub>;
  };

  let mockBookingsService: {
    addBooking: Cypress.Agent<sinon.SinonStub>;
  };

  let mockNotificationService: {
    showSuccess: Cypress.Agent<sinon.SinonStub>;
    showError: Cypress.Agent<sinon.SinonStub>;
  };

  beforeEach(() => {
    mockEventsService = {
      getUserEvents: cy
        .stub()
        .returns(of({ message: 'success', events: [mockEvent] })) as any,
      refreshUserEvents: cy.stub(),
      filteredEvents$: of([mockEvent]),
    };

    mockRegisterService = {
      getUser: cy.stub().returns(of(mockUser)) as any,
    };

    mockBookingsService = {
      addBooking: cy.stub().returns(of({})) as any,
    };

    mockNotificationService = {
      showSuccess: cy.stub(),
      showError: cy.stub(),
    };

    cy.mount(ViewEventsComponent, {
      imports: [NavbarComponent, CardComponent, BookEventModalComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });
  });

  it('should render correctly', () => {
    cy.get('app-navbar').should('exist');
    cy.get('app-card').should('have.length', 1);
  });

  it('should load and display events', () => {
    cy.wrap(mockEventsService.getUserEvents).should('have.been.called');
    cy.get('app-card').should('contain', 'Test Event');
    cy.get('app-card').should('contain', 'Tech');
  });

  it('should load user data', () => {
    cy.wrap(mockRegisterService.getUser).should('have.been.called');
  });

  it('should show empty state when no events', () => {
    mockEventsService.getUserEvents = cy
      .stub()
      .returns(of({ events: [] })) as any;
    mockEventsService.filteredEvents$ = of([]);

    cy.mount(ViewEventsComponent, {
      imports: [NavbarComponent, CardComponent, BookEventModalComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    cy.get('app-card').should('not.exist');
  });

  describe('Book Event', () => {
    it('should open booking modal when book button clicked', () => {
      cy.get('app-card').first().find('[data-cy="book-event-btn"]').click();
      cy.get('app-book-event-modal').should('exist');
    });

    it('should close booking modal', () => {
      cy.get('app-card').first().find('[data-cy="book-event-btn"]').click();
      cy.get('[data-cy="close-bookEvent-modal-btn"]').click();
      cy.get('app-book-event-modal')
        .get('.modal')
        .should('have.css', 'display', 'none');
      cy.get('app-book-event-modal').get('.modal').should('not.be.visible');
    });

    it('should book event when form submitted', () => {
      const bookingData = {
        eventId: mockEvent._id,
        userId: mockUser.userData.userId,
        userDetails: {
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '+1234567890',
        },
      };

      cy.get('app-card').first().find('[data-cy="book-event-btn"]').click();

      cy.get('[data-cy="booking-fullName-input"]').type(
        bookingData.userDetails.fullName
      );
      cy.get('[data-cy="booking-email-input"]').type(
        bookingData.userDetails.email
      );
      cy.get('[data-cy="booking-phone-input"]').type(
        bookingData.userDetails.phoneNumber
      );

      cy.get('[data-cy="submit-booking-btn"]').click();

      cy.wrap(mockBookingsService.addBooking).should('have.been.calledWith', {
        eventId: bookingData.eventId,
        userId: bookingData.userId,
        userDetails: bookingData.userDetails,
      });

      cy.wrap(mockEventsService.refreshUserEvents).should('have.been.called');
      cy.wrap(mockNotificationService.showSuccess).should(
        'have.been.calledWith',
        'Event has been Booked'
      );
    });

    it('should show error when booking fails', () => {
      const errorResponse = {
        error: {
          error: 'Booking failed - no seats available',
        },
      };

      mockBookingsService.addBooking = cy
        .stub()
        .returns(throwError(() => errorResponse)) as any;

      cy.get('app-card').first().find('[data-cy="book-event-btn"]').click();

      cy.get('[data-cy="booking-fullName-input"]').type('Test User');
      cy.get('[data-cy="booking-email-input"]').type('test@example.com');
      cy.get('[data-cy="booking-phone-input"]').type('+1234567890');

      cy.get('[data-cy="submit-booking-btn"]').click();

      cy.wrap(mockNotificationService.showError).should('have.been.called');
    });
  });
});
