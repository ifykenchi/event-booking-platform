import { BookingDetailsComponent } from './booking-details.component';
import { BookingDataI } from '../../../interfaces/services.interfaces';

describe('BookingDetailsComponent', () => {
  const mockBookingData: BookingDataI = {
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

  beforeEach(() => {
    cy.mount(BookingDetailsComponent, {
      componentProperties: {
        bookingData: mockBookingData,
        showDetailsModal: true,
      },
    });
  });

  it('should not display modal when showDetailsModal is false', () => {
    cy.mount(BookingDetailsComponent, {
      componentProperties: {
        bookingData: mockBookingData,
        showDetailsModal: false,
      },
    });

    cy.get('.modal-overlay').should('not.exist');
  });

  it('should display modal when showDetailsModal is true', () => {
    cy.get('.modal-overlay').should('exist');
    cy.get('.modal-content').should('be.visible');
  });

  it('should display correct booking details', () => {
    cy.get('.list-group-item').should('have.length', 6);

    cy.contains('.list-group-item', 'Event: Test Event').should('exist');
    cy.contains('.list-group-item', 'Username: jane doe').should('exist');
    cy.contains('.list-group-item', 'Full Name: jane doe').should('exist');
    cy.contains('.list-group-item', 'Email: jane@example.com').should('exist');
    cy.contains('.list-group-item', 'Phone Number: 1234567890').should('exist');
    cy.contains('.list-group-item', 'Price at Booking: ₦1,000.00').should(
      'exist'
    );
  });

  it('should format price correctly when price is 0', () => {
    cy.mount(BookingDetailsComponent, {
      componentProperties: {
        bookingData: {
          ...mockBookingData,
          priceAtBooking: 0,
        },
        showDetailsModal: true,
      },
    });

    cy.contains('.list-group-item', 'Price at Booking: ₦0.00').should('exist');
  });

  it('should emit closeDetailsModal event when close button is clicked', () => {
    const closeSpy = cy.spy().as('closeSpy');

    cy.mount(BookingDetailsComponent, {
      componentProperties: {
        bookingData: mockBookingData,
        showDetailsModal: true,
        closeDetailsModal: {
          emit: closeSpy,
        } as any,
      },
    });

    cy.get('.btn-danger').click();
    cy.get('@closeSpy').should('have.been.calledOnce');
  });

  describe('Visual Elements', () => {
    it('should have correct card styling', () => {
      cy.get('.card').should('exist');
      cy.get('.card-header').should('contain', 'Booked user details');
      cy.get('.card-body').should('exist');
    });

    it('should display all list items properly', () => {
      cy.get('.list-group-item').each(($el) => {
        cy.wrap($el).should('be.visible');
      });
    });
  });
});
