describe('User Create Page', () => {
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

  beforeEach(() => {
    cy.addAdminToken();
    cy.loginUser(validUser);
    cy.deleteEventByTitle(mockEvent.title);
    cy.createEvent(mockEvent);
    cy.clearLocalStorage('adminToken');
    cy.reload();
  });

  it('should book an event successfully', () => {
    cy.visit('/user/events');

    cy.contains('app-card', mockEvent.title)
      .find('[data-cy="book-event-btn"]')
      .click();

    cy.get('.toast-success')
      .should('contain', 'Event has been Booked')
      .and('be.visible');
  });
});
