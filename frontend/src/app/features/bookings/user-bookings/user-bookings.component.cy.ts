import { UserBookingsComponent } from './user-bookings.component';
import { BookingsService } from '../../../services/bookings.service';
import { NotificationService } from '../../../services/notification.service';
import { RegisterService } from '../../../services/register.service';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { BookingDetailsComponent } from '../../../core/components/booking-details/booking-details.component';
import { BookedCardComponent } from '../../../core/components/booked-card/booked-card.component';
import { of, throwError } from 'rxjs';

describe('UserBookingsComponent', () => {
  const mockBooking = {
    _id: '1',
    eventId: {
      _id: 'event123',
      title: 'Test Event',
      category: 'Tech',
      totalSeats: 100,
    },
    userId: {
      id: 'user123',
      username: 'testuser',
      email: 'testuser@example.com',
    },
    userDetails: {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '+1234567890',
    },
    status: true,
    priceAtBooking: 1000,
    createdOn: '12th Nov, 2025',
  };

  let mockBookingsService: {
    getUserBookings: Cypress.Agent<sinon.SinonStub>;
    cancelBooking: Cypress.Agent<sinon.SinonStub>;
    refreshUserBookings: Cypress.Agent<sinon.SinonStub>;
    filteredBookings$: any;
  };

  let mockNotificationService: {
    showSuccess: Cypress.Agent<sinon.SinonStub>;
    showError: Cypress.Agent<sinon.SinonStub>;
  };

  let mockRegisterService: {
    getUser: Cypress.Agent<sinon.SinonStub>;
  };

  beforeEach(() => {
    mockRegisterService = {
      getUser: cy.stub().returns(
        of({
          message: 'success',
          userData: { userId: 'user123', username: 'testuser' },
        })
      ),
    } as any;

    mockBookingsService = {
      getUserBookings: cy.stub().returns(
        of({
          message: 'success',
          bookings: [mockBooking],
          availableSeats: 99,
        })
      ) as any,
      cancelBooking: cy.stub().returns(of({})) as any,
      refreshUserBookings: cy.stub(),
      filteredBookings$: of([mockBooking]),
    };

    mockNotificationService = {
      showSuccess: cy.stub(),
      showError: cy.stub(),
    };

    cy.mount(UserBookingsComponent, {
      imports: [
        ConfirmationModalComponent,
        BookingDetailsComponent,
        BookedCardComponent,
      ],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: RegisterService, useValue: mockRegisterService },
      ],
    });
  });

  it('should render correctly', () => {
    cy.get('h2').should('contain', 'Bookings');
    cy.get('app-booked-card').should('exist');
  });

  it('should load and display user bookings', () => {
    cy.get('app-booked-card').first().should('have.length', 1);
    cy.wrap(mockBookingsService.getUserBookings).should(
      'have.been.calledWith',
      'user123'
    );
  });

  it('should show empty state when no bookings', () => {
    mockBookingsService.getUserBookings = cy.stub().returns(
      of({
        message: 'success',
        bookings: [],
        availableSeats: 99,
      })
    ) as any;
    mockBookingsService.filteredBookings$ = of([]);

    cy.mount(UserBookingsComponent, {
      imports: [
        ConfirmationModalComponent,
        BookingDetailsComponent,
        BookedCardComponent,
      ],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: RegisterService, useValue: mockRegisterService },
      ],
    });

    cy.get('app-booked-card').should('not.exist');
  });

  describe('Cancel Booking', () => {
    it('should open confirmation modal when cancel is clicked', () => {
      cy.get('app-booked-card')
        .first()
        .find('[data-cy="cancel-booking-btn"]')
        .click();
      cy.get('app-confirmation-modal').should('exist');
      cy.contains('Are you sure you want to cancel your booking?');
    });

    it('should close modal when cancelled', () => {
      cy.get('app-booked-card')
        .first()
        .find('[data-cy="cancel-booking-btn"]')
        .click();
      cy.get('[data-cy="confirmModal-close-btn"]').click();
      cy.get('app-confirmation-modal').get('.modal').should('not.be.visible');
      cy.get('app-confirmation-modal')
        .get('.modal')
        .should('have.css', 'display', 'none');
    });

    it('should cancel booking when confirmed', () => {
      cy.get('app-booked-card')
        .first()
        .find('[data-cy="cancel-booking-btn"]')
        .click();
      cy.get('[data-cy="confirmModal-modalType-btn"]').click();

      cy.wrap(mockBookingsService.cancelBooking).should(
        'have.been.calledWith',
        '1'
      );
      cy.wrap(mockBookingsService.refreshUserBookings).should(
        'have.been.calledWith',
        'user123'
      );
      cy.wrap(mockNotificationService.showSuccess).should(
        'have.been.calledWith',
        'Your booking has been cancelled'
      );
    });

    it('should show error when cancel fails', () => {
      mockBookingsService.cancelBooking = cy
        .stub()
        .returns(throwError(() => new Error('Cancel failed'))) as any;

      cy.get('app-booked-card')
        .first()
        .find('[data-cy="cancel-booking-btn"]')
        .click();
      cy.get('[data-cy="confirmModal-modalType-btn"]').click();

      cy.wrap(mockNotificationService.showError).should(
        'have.been.calledWith',
        'Failed to cancel booking'
      );
    });
  });

  describe('Booking Details', () => {
    it('should open details modal when details button is clicked', () => {
      cy.get('app-booked-card')
        .first()
        .find('[data-cy="view-details-btn"]')
        .click();
      cy.get('app-booking-details').should('exist');
    });

    it('should close details modal', () => {
      cy.get('app-booked-card')
        .first()
        .find('[data-cy="view-details-btn"]')
        .click();
      cy.get('[data-cy="close-details-btn"]').click();
      cy.get('app-booking-details').should('not.exist');
    });
  });
});
