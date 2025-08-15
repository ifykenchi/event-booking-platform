describe('Admin Login', () => {
  it('Visits the Admin Login page', () => {
    cy.visit('http://localhost:4200/admin/login');
  });

  it('logs in successfully', () => {
    const validAdmin = {
      email: 'ifykenchi@gmail.com',
      password: 'ifeanyi123',
    };

    cy.visit('http://localhost:4200/admin/login');

    cy.get('#email').type(validAdmin.email);
    cy.get('#password').type(validAdmin.password);
    cy.get('button[type="submit"]').click();

    cy.get('.toast-success').should('contain', 'Logged In').and('be.visible');

    cy.contains('.fs-4', 'Welcome Ifeanyi').should('exist');
    cy.get('.nav-link').should('have.length', 3);
    cy.contains('.nav-link', 'Dashboard').should('exist');
    cy.contains('.nav-link', 'Events').should('exist');
    cy.contains('.nav-link', 'Bookings').should('exist');

    cy.get('h1').should('contain', 'Event Management Dashboard');
    cy.contains('.card-title', 'Total Events').should('exist');
    cy.contains('.card-title', 'Total Bookings').should('exist');
    cy.contains('.card-title', 'Total Revenue').should('exist');
    cy.contains('.card-title', 'Top Event(s)').should('exist');
    cy.contains('.card-title', 'Bookings Overview').should('exist');
  });
});
