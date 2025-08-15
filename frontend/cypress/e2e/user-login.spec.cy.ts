import { NotificationService } from '../../src/app/services/notification.service';

describe('User Login', () => {
  it('Visits the User Login page', () => {
    cy.visit('http://localhost:4200/user/login');
  });

  it('logs in successfully', () => {
    const validUser = {
      email: 'ifykenchi@gmail.com',
      password: 'ifeanyi123',
    };

    cy.visit('http://localhost:4200/user/login');

    cy.get('#email').type(validUser.email);
    cy.get('#password').type(validUser.password);
    cy.get('button[type="submit"]').click();

    cy.get('.toast-success').should('contain', 'Logged In').and('be.visible');

    cy.contains('.fs-4', 'Welcome Ifeanyi').should('exist');
    cy.get('.nav-link').should('have.length', 3);
    cy.contains('.nav-link', 'Dashboard').should('exist');
    cy.contains('.nav-link', 'Events').should('exist');
    cy.contains('.nav-link', 'Bookings').should('exist');
  });
});
