describe('User Events Page', () => {
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
    cy.clearLocalStorage('adminToken');
    cy.reload();
  });

  it('should book an event successfully', () => {
    cy.visit('/user/events');

    cy.contains('app-card', mockEvent.title)
      .find('[data-cy="book-event-btn"]')
      .click();

    cy.get('app-book-event-modal').should('exist');
    cy.get('[data-cy="booking-fullName-input"]').type(validBooking.fullName);
    cy.get('[data-cy="booking-email-input"]').type(validBooking.email);
    cy.get('[data-cy="booking-phone-input"]').type(validBooking.phoneNumber);
    cy.get('[data-cy="submit-booking-btn"]').click();

    cy.get('.toast-success')
      .should('contain', 'Event has been Booked')
      .and('be.visible');
  });
});
