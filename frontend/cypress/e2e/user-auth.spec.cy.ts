describe('User Auth', () => {
  after(() => {
    cy.request('DELETE', 'http://localhost:8082/user-delete');
  });

  describe('User Signup', () => {
    it('signs up successfully', () => {
      const validUser = {
        username: 'Canada',
        email: 'canada@gmail.com',
        password: 'canada123',
      };

      cy.visit('/user/register');

      cy.get('#username').type(validUser.username);
      cy.get('#email').type(validUser.email);
      cy.get('#password').type(validUser.password);
      cy.get('button[type="submit"]').click();

      cy.get('.toast-success')
        .should('contain', 'You are Signed Up!')
        .and('be.visible');

      cy.contains('.fs-4', 'Welcome Canada').should('exist');
      cy.get('.nav-link').should('have.length', 3);
      cy.contains('.nav-link', 'Dashboard').should('exist');
      cy.contains('.nav-link', 'Events').should('exist');
      cy.contains('.nav-link', 'Bookings').should('exist');
    });
  });

  // describe('User Login', () => {
  //   it('logs in successfully', () => {
  //     const validUser = {
  //       email: 'banana@gmail.com',
  //       password: 'banana123',
  //     };

  //     cy.visit('/user/login');

  //     cy.get('#email').type(validUser.email);
  //     cy.get('#password').type(validUser.password);
  //     cy.get('button[type="submit"]').click();

  //     cy.get('.toast-success').should('contain', 'Logged In').and('be.visible');

  //     cy.contains('.fs-4', 'Welcome Banana').should('exist');
  //     cy.get('.nav-link').should('have.length', 3);
  //     cy.contains('.nav-link', 'Dashboard').should('exist');
  //     cy.contains('.nav-link', 'Events').should('exist');
  //     cy.contains('.nav-link', 'Bookings').should('exist');
  //   });
  // });
});
