describe('User Auth Page', () => {
  const validUser = {
    username: 'johnny',
    email: 'johnny@gmail.com',
    password: 'johnny123',
  };

  describe('User Signup', () => {
    it('signs up successfully', () => {
      cy.signupUser(validUser);
    });
  });

  describe('User Login', () => {
    it('logs in successfully', () => {
      cy.signupUser(validUser);

      cy.visit('/user/login');

      cy.get('#email').type(validUser.email);
      cy.get('#password').type(validUser.password);
      cy.get('button[type="submit"]').click();

      cy.get('.toast-success').should('contain', 'Logged In').and('be.visible');

      cy.contains('.fs-4', 'Welcome johnny').should('exist');
    });
  });
});
