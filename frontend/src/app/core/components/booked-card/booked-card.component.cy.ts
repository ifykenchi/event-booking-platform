import { BookedCardComponent } from './booked-card.component';
import { LocalStorageService } from '../../../services/localStorage.service';

describe('BookedCardComponent', () => {
  const mockBookingData = {
    _id: 'booking-123',
    eventId: {
      _id: 'event-456',
      title: 'Test Event',
      category: 'Tech',
      totalSeats: 100,
    },
    userId: {
      _id: 'user123',
      username: 'jane doe',
      email: 'jane@example.com',
    },
    userDetails: {
      fullName: 'jane doe',
      email: 'jane@example.com',
      phoneNumber: '1234567890',
    },
    priceAtBooking: 1000,
    status: true,
    createdOn: '12th nov, 2025',
  };

  let mockLocalStorageService: any;

  beforeEach(() => {
    mockLocalStorageService = {
      isAdmin: cy.stub(),
    };
    mockLocalStorageService.isAdmin.returns(false);

    cy.mount(BookedCardComponent, {
      componentProperties: {
        bookingData: mockBookingData,
      },
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });
  });

  it('should not render for admin users', () => {
    mockLocalStorageService.isAdmin.returns(true);
    cy.mount(BookedCardComponent, {
      componentProperties: {
        bookingData: mockBookingData,
      },
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });

    cy.get('app-booked-card').should('not.exist');
  });

  it('should display correct event information', () => {
    cy.get('.card-title').should('contain', 'Test Event');
    cy.get('.badge').first().should('contain', 'category: Tech');
  });

  describe('Active Booking State', () => {
    it('should show price badge with correct styling and format', () => {
      cy.get('.badge.text-bg-info').should(
        'contain',
        'Price at booking: ₦1,000.00'
      );
    });

    it('should show "Booked" status badge', () => {
      cy.get('.badge.text-bg-success').should('contain', 'Booked');
    });

    it('should show "Free" badge when price is 0', () => {
      cy.mount(BookedCardComponent, {
        componentProperties: {
          bookingData: {
            ...mockBookingData,
            priceAtBooking: 0,
          },
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.badge.text-bg-success').should(
        'contain',
        'Price at booking: Free'
      );
    });

    it('should emit cancelBooking event when cancel button is clicked', () => {
      const cancelSpy = cy.spy().as('cancelSpy');

      cy.mount(BookedCardComponent, {
        componentProperties: {
          bookingData: mockBookingData,
          cancelBooking: {
            emit: cancelSpy,
          } as any,
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.btn-danger').click();
      cy.get('@cancelSpy').should('have.been.calledOnceWith', 'booking-123');
    });

    it('should emit openDetailsModal event when view details button is clicked', () => {
      const detailsSpy = cy.spy().as('detailsSpy');

      cy.mount(BookedCardComponent, {
        componentProperties: {
          bookingData: mockBookingData,
          openDetailsModal: {
            emit: detailsSpy,
          } as any,
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.btn-primary').click();
      cy.get('@detailsSpy').should('have.been.calledOnceWith', mockBookingData);
    });
  });

  describe('Cancelled Booking State', () => {
    beforeEach(() => {
      cy.mount(BookedCardComponent, {
        componentProperties: {
          bookingData: {
            ...mockBookingData,
            status: false,
          },
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });
    });

    it('should show "Cancelled" status badge', () => {
      cy.get('.badge.text-bg-danger').should('contain', 'Cancelled');
    });

    it('should not show action buttons for cancelled bookings', () => {
      cy.get('.btn-danger').should('not.exist');
      cy.get('.btn-primary').should('not.exist');
    });
  });

  describe('Visual Elements', () => {
    it('should have correct card styling', () => {
      cy.get('.card').should('have.css', 'width', '288px');
      cy.get('.card-body').should('exist');
    });

    it('should have correct badge styling', () => {
      cy.get('.badge.rounded-pill').should('have.length.at.least', 2);
    });
  });
});
