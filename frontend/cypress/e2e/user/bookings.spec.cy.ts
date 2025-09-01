describe('User Bookings Page', () => {
  const validUser = {
    username: 'johnny',
    email: 'johnny@gmail.com',
    password: 'johnny123',
  };

  const mockEvent = {
    title: 'Test Event',
    about: 'Test event description',
    totalSeats: 100,
    category: 'Tech',
    price: 1000,
  };

  const validBooking = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
  };

  beforeEach(() => {
    cy.addAdminToken();
    cy.loginUser(validUser);
    cy.deleteEventByTitle(mockEvent.title);
    cy.createEvent(mockEvent);
    cy.deleteBookingByEmail(validBooking.email);
    cy.getUserId().then((userId) => {
      cy.getEventIdByTitle(mockEvent.title).then((eventId) => {
        cy.addBooking(eventId, userId, validBooking);
      });
    });
    cy.clearLocalStorage('adminToken');
    cy.reload();
  });

  it('should cancel a booked event successfully', () => {
    cy.visit('/user/bookings');

    cy.contains('app-booked-card', mockEvent.title)
      .find('[data-cy="cancel-booking-btn"]')
      .click();
    cy.get('app-confirmation-modal')
      .find('[data-cy="confirmModal-modalType-btn"]')
      .click();

    cy.get('app-booked-card').should('contain', 'Cancelled');
    cy.get('.toast-success')
      .should('contain', 'Your booking has been cancelled')
      .and('be.visible');
  });

  it('should view booking details', () => {
    cy.visit('/user/bookings');

    cy.contains('app-booked-card', mockEvent.title)
      .find('[data-cy="view-details-btn"]')
      .click();

    cy.get('app-booking-details')
      .should('contain', validBooking.fullName)
      .and('contain', validBooking.email)
      .and('contain', validBooking.phoneNumber);
  });
});
