import { AdminBookingsComponent } from './admin-bookings.component';
import { BookingsService } from '../../../services/bookings.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
import { of, throwError } from 'rxjs';

describe('AdminBookingsComponent', () => {
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
    getAllBookings: any;
    deleteBooking: Cypress.Agent<sinon.SinonStub>;
    refreshAdminBookings: Cypress.Agent<sinon.SinonStub>;
    filteredBookings$: any;
  };
  let mockNotificationService: {
    showSuccess: Cypress.Agent<sinon.SinonStub>;
    showError: Cypress.Agent<sinon.SinonStub>;
  };

  beforeEach(() => {
    mockBookingsService = {
      getAllBookings: () =>
        of({
          message: 'success',
          bookings: [mockBooking],
          availableSeats: 99,
        }),
      deleteBooking: cy.stub().returns(of({})) as any,
      refreshAdminBookings: cy.stub(),
      filteredBookings$: of([mockBooking]),
    };

    mockNotificationService = {
      showSuccess: cy.stub(),
      showError: cy.stub(),
    };

    cy.mount(AdminBookingsComponent, {
      imports: [ConfirmationModalComponent],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    });
  });

  it('should render correctly', () => {
    cy.get('h2').should('contain', 'Bookings');
    cy.get('table').should('exist');
  });

  it('should display bookings data', () => {
    cy.contains('Test Event').should('exist');
    cy.contains('testuser').should('exist');
    cy.contains('Test User').should('exist');
    cy.contains('test@example.com').should('exist');
    cy.contains('+1234567890').should('exist');
    cy.contains('Booked').should('exist');
  });

  it('should show empty state when no bookings', () => {
    cy.mount(AdminBookingsComponent, {
      imports: [ConfirmationModalComponent],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            getAllBookings: () =>
              of({
                message: 'success',
                bookings: [mockBooking],
                availableSeats: 99,
              }),
            deleteBooking: cy.stub().returns(of({})),
            refreshAdminBookings: cy.stub(),
            filteredBookings$: of([]),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            showSuccess: cy.stub(),
            showError: cy.stub(),
          },
        },
      ],
    });
    cy.contains('No bookings found').should('exist');
  });

  describe('Delete Booking', () => {
    it('should open confirmation modal when delete clicked', () => {
      cy.get('table .btn-danger').eq(0).click();
      cy.get('app-confirmation-modal').should('exist');
      cy.contains('this is irreversible. Are you sure you want to delete?');
    });

    it('should close modal when cancelled', () => {
      cy.get('table .btn-danger').eq(0).click();

      cy.get('app-confirmation-modal').should('exist');
      cy.get('[data-cy="confirmModal-close-btn"]').click();
      cy.get('app-confirmation-modal')
        .get('.modal')
        .should('have.css', 'display', 'none');
      cy.get('app-confirmation-modal').get('.modal').should('not.be.visible');
    });

    it('should delete booking when confirmed', () => {
      cy.get('table .btn-danger').eq(0).click();
      cy.get('[data-cy="confirmModal-modalType-btn"]').click();

      cy.get('app-confirmation-modal')
        .get('.modal')
        .should('have.css', 'display', 'none');
      cy.get('app-confirmation-modal').get('.modal').should('not.be.visible');

      cy.wrap(mockBookingsService.deleteBooking).should(
        'have.been.calledWith',
        '1'
      );
      cy.wrap(mockBookingsService.refreshAdminBookings).should(
        'have.been.called'
      );
      cy.wrap(mockNotificationService.showSuccess).should(
        'have.been.calledWith',
        'the booking has been deleted'
      );
    });

    it('should show error when delete fails', () => {
      mockBookingsService.deleteBooking = cy
        .stub()
        .returns(throwError(() => new Error('Delete failed'))) as any;

      cy.get('table .btn-danger').eq(0).click();
      cy.get('[data-cy="confirmModal-modalType-btn"]').click();

      cy.wrap(mockNotificationService.showError).should(
        'have.been.calledWith',
        'Failed to delete booking'
      );
    });
  });

  it('should show cancelled status correctly', () => {
    mockBookingsService = {
      getAllBookings: () =>
        of({
          message: 'success',
          bookings: [{ ...mockBooking, status: false }],
          availableSeats: 99,
        }),
      deleteBooking: cy.stub().returns(of({})) as any,
      refreshAdminBookings: cy.stub(),
      filteredBookings$: of([{ ...mockBooking, status: false }]),
    };

    mockNotificationService = {
      showSuccess: cy.stub(),
      showError: cy.stub(),
    };

    cy.mount(AdminBookingsComponent, {
      imports: [ConfirmationModalComponent],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    });

    cy.contains('Cancelled').should('exist');
    cy.get('.badge-cancelled').should('exist');
  });
});
