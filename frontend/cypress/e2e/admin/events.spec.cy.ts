describe('Admin Events page', () => {
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

  beforeEach(() => {
    cy.loginAdmin(validAdmin);
    cy.deleteEventByTitle(mockEvent.title);
  });

  it('should create an event successfully', () => {
    cy.visit('/admin/events');

    cy.contains('button', 'Add Event').click();
    cy.get('[data-cy="event-title-input"]').type(mockEvent.title);
    cy.get('[data-cy="event-about-input"]').type(mockEvent.about);
    cy.get('[data-cy="event-totalSeats-input"]').type(
      mockEvent.totalSeats.toString()
    );
    cy.get('[data-cy="event-category-input"]').select(mockEvent.category);
    cy.get('[data-cy="event-price-input"]').type(mockEvent.price.toString());
    cy.get('[data-cy="submit-add-event-btn"]').click();

    cy.get('.toast-success')
      .should('contain', 'Event created')
      .and('be.visible');
    cy.get('app-card').should('contain', 'Test Event');
  });

  it('should delete an event successfully', () => {
    cy.visit('/admin/events');

    cy.createEvent(mockEvent);
    cy.reload();
    cy.contains('app-card', mockEvent.title)
      .find('[data-cy="delete-event-btn"]')
      .click();
    cy.get('app-events-modal').should('exist');
    cy.get('app-confirmation-modal')
      .find('[data-cy="confirmModal-modalType-btn"]')
      .click();

    cy.get('.toast-success')
      .should('contain', 'Event Deleted')
      .and('be.visible');
    cy.get('app-card').should('not.contain', mockEvent.title);
  });

  it('should edit an event successfully', () => {
    cy.visit('/admin/events');

    cy.createEvent(mockEvent);
    cy.reload();
    cy.contains('app-card', mockEvent.title)
      .find('[data-cy="edit-event-btn"]')
      .click();
    cy.get('app-events-modal').should('exist');
    cy.get('[data-cy="editEvent-about-input"]')
      .clear()
      .type('Edited event description');
    cy.get('[data-cy="submit-edit-event-btn"]').click();

    cy.get('.toast-success')
      .should('contain', 'Event updated')
      .and('be.visible');
    cy.get('app-card').should('contain', 'Edited event description');
  });
});
