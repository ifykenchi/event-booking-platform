describe('Admin Auth', () => {
  const validAdmin = {
    username: 'charles',
    email: 'charles@gmail.com',
    password: 'charles123',
  };

  describe('Admin Signup', () => {
    it('signs up successfully', () => {
      cy.signupAdmin(validAdmin);
    });
  });

  describe('Admin Login', () => {
    it('logs in successfully', () => {
      cy.signupAdmin(validAdmin);

      cy.visit('/admin/login');

      cy.get('#email').type(validAdmin.email);
      cy.get('#password').type(validAdmin.password);
      cy.get('button[type="submit"]').click();

      cy.get('.toast-success').should('contain', 'Logged In').and('be.visible');

      cy.contains('.fs-4', 'Welcome charles').should('exist');
      cy.get('h1').should('contain', 'Event Management Dashboard');
    });
  });
});
