// describe('My First Test', () => {
//   it('Visits the Kitchen Sink', () => {
//     cy.visit('https://example.cypress.io');

//     cy.contains('type').click();

//     cy.url().should('include', '/commands/actions');
//   });
// });

describe('My First Test', () => {
  it('Visits the User Register page', () => {
    cy.visit('http://localhost:4200/user/register');
  });
});
