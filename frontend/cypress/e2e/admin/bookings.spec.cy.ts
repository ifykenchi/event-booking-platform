describe('Admin Bookings Page', () => {
  const validAdmin = {
    username: 'charles',
    email: 'charles@gmail.com',
    password: 'charles123',
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
    cy.loginAdmin(validAdmin);
    cy.deleteEventByTitle(mockEvent.title);
    cy.createEvent(mockEvent);
    cy.deleteBookingByEmail(validBooking.email);
    cy.addUserToken();
    cy.getUserId().then((userId) => {
      cy.getEventIdByTitle(mockEvent.title).then((eventId) => {
        cy.addBooking(eventId, userId, validBooking);
      });
    });
    cy.clearLocalStorage('accessToken');
    cy.reload();
  });

  it('should cancel a booked event successfully', () => {
    cy.visit('/admin/bookings');

    cy.get('tbody tr').should('have.length.gt', 0);

    cy.contains('tbody tr', mockEvent.title)
      .should('contain', validBooking.email)
      .within(() => {
        cy.get('.btn-danger').should('contain', 'Delete').click();
      });
    cy.get('app-confirmation-modal')
      .find('[data-cy="confirmModal-modalType-btn"]')
      .click();

    cy.get('.toast-success')
      .should('contain', 'the booking has been deleted')
      .and('be.visible');
    cy.contains('tbody tr', mockEvent.title).should('not.exist');
  });
});
