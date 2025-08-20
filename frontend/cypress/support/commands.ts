/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Deletes a user by email via API
       * @param email - The email of the user to delete
       * @example cy.deleteUserByEmail('test@example.com')
       */
      deleteUserByEmail(email: string): Chainable<void>;
      deleteAdminByEmail(email: string): Chainable<void>;
      addAdminToken(): Chainable<void>;
      signupUser(user: {
        username: string;
        email: string;
        password: string;
      }): Chainable<void>;
      signupAdmin(admin: {
        username: string;
        email: string;
        password: string;
      }): Chainable<void>;
      loginAdmin(admin: {
        username: string;
        email: string;
        password: string;
      }): Chainable<void>;
      loginUser(user: {
        username: string;
        email: string;
        password: string;
      }): Chainable<void>;
      deleteEventByTitle(eventTitle: string): Chainable<void>;
      createEvent(mockEvent: {
        title: string;
        about: string;
        totalSeats: number;
        category: string;
        price: number;
      }): Chainable<void>;
    }
  }
}

Cypress.Commands.add('deleteUserByEmail', (email: string) => {
  cy.request({
    method: 'DELETE',
    url: `http://localhost:8082/user/${email}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('deleteAdminByEmail', (email: string) => {
  cy.request({
    method: 'DELETE',
    url: `http://localhost:8082/admin/${email}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('addAdminToken', () => {
  const validAdmin = {
    username: 'charles',
    email: 'charles@gmail.com',
    password: 'charles123',
  };

  cy.deleteAdminByEmail(validAdmin.email);

  cy.request({
    method: 'POST',
    url: 'http://localhost:8082/admin/register',
    body: {
      username: validAdmin.username,
      email: validAdmin.email,
      password: validAdmin.password,
    },
    failOnStatusCode: false,
  }).then((signupResponse) => {
    if (signupResponse.status !== 201 && signupResponse.status !== 200) {
      cy.log('Admin already exists');
    }

    const adminToken = signupResponse.body.adminToken;
    window.localStorage.setItem('adminToken', adminToken);
  });

  cy.deleteAdminByEmail(validAdmin.email);
});

Cypress.Commands.add(
  'signupUser',
  (user: { username: string; email: string; password: string }) => {
    cy.deleteUserByEmail(user.email);

    cy.visit('/user/register');

    cy.get('#username').type(user.username);
    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();

    cy.get('.toast-success')
      .should('contain', 'You are Signed Up!')
      .and('be.visible');

    cy.contains('.fs-4', `Welcome ${user.username}`).should('exist');
  }
);

Cypress.Commands.add(
  'signupAdmin',
  (admin: { username: string; email: string; password: string }) => {
    cy.deleteAdminByEmail(admin.email);

    cy.visit('/admin/register');

    cy.get('#username').type(admin.username);
    cy.get('#email').type(admin.email);
    cy.get('#password').type(admin.password);
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();

    cy.get('.toast-success')
      .should('contain', 'You are Signed Up!')
      .and('be.visible');

    cy.contains('.fs-4', `Welcome ${admin.username}`).should('exist');
  }
);

Cypress.Commands.add(
  'loginAdmin',
  (admin: { username: string; email: string; password: string }) => {
    cy.deleteAdminByEmail(admin.email);

    cy.request({
      method: 'POST',
      url: 'http://localhost:8082/admin/register',
      body: {
        username: admin.username,
        email: admin.email,
        password: admin.password,
      },
      failOnStatusCode: false,
    }).then((signupResponse) => {
      if (signupResponse.status !== 201 && signupResponse.status !== 200) {
        cy.log('Admin may already exist, proceeding to login');
      }

      cy.request({
        method: 'POST',
        url: 'http://localhost:8082/admin/login',
        body: {
          email: admin.email,
          password: admin.password,
        },
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);
        expect(loginResponse.body).to.have.property('adminToken');

        const adminToken = loginResponse.body.adminToken;
        window.localStorage.setItem('adminToken', adminToken);
      });
    });
  }
);

Cypress.Commands.add(
  'loginUser',
  (user: { username: string; email: string; password: string }) => {
    cy.deleteUserByEmail(user.email);

    cy.request({
      method: 'POST',
      url: 'http://localhost:8082/user/register',
      body: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
      failOnStatusCode: false,
    }).then((signupResponse) => {
      if (signupResponse.status !== 201 && signupResponse.status !== 200) {
        cy.log('User may already exist, proceeding to login');
      }

      cy.request({
        method: 'POST',
        url: 'http://localhost:8082/user/login',
        body: {
          email: user.email,
          password: user.password,
        },
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);
        expect(loginResponse.body).to.have.property('accessToken');

        const accessToken = loginResponse.body.accessToken;
        window.localStorage.setItem('accessToken', accessToken);
      });
    });
  }
);

Cypress.Commands.add('deleteEventByTitle', (eventTitle: string) => {
  const adminToken = window.localStorage.getItem('adminToken');

  if (!adminToken) {
    throw new Error('Admin token not found. Please login as admin first.');
  }

  cy.request({
    method: 'GET',
    url: 'http://localhost:8082/admin/events',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    const events = response.body.events;
    const eventToDelete = events.find(
      (event: any) => event.title === eventTitle
    );

    if (!eventToDelete) {
      cy.log(`Event with title "${eventTitle}" not found. Nothing to delete.`);
      return;
    }

    cy.request({
      method: 'DELETE',
      url: `http://localhost:8082/admin/delete/${eventToDelete._id}`,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.be.oneOf([200, 204]);
      cy.log(`Successfully deleted event: ${eventTitle}`);
    });
  });
});

Cypress.Commands.add(
  'createEvent',
  (mockEvent: {
    title: string;
    about: string;
    totalSeats: number;
    category: string;
    price: number;
  }) => {
    const adminToken = window.localStorage.getItem('adminToken');
    if (!adminToken) {
      throw new Error('Admin token not found. Please login as admin first.');
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:8082/admin/event',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: mockEvent,
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
    });
  }
);

export {};
