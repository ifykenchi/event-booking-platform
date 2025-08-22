/// <reference types="cypress" />

import { apiBaseUrl } from '../constants';

declare global {
  namespace Cypress {
    interface Chainable {
      deleteUserByEmail(email: string): Chainable<void>;
      deleteAdminByEmail(email: string): Chainable<void>;
      addAdminToken(): Chainable<void>;
      addUserToken(): Chainable<void>;
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
      }): Chainable<any>;
      loginUser(user: {
        username: string;
        email: string;
        password: string;
      }): Chainable<void>;
      getUserId(): Chainable<string>;
    }
  }
}

Cypress.Commands.add('deleteUserByEmail', (email: string) => {
  cy.request({
    method: 'DELETE',
    url: `${apiBaseUrl}/user/${email}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('deleteAdminByEmail', (email: string) => {
  cy.request({
    method: 'DELETE',
    url: `${apiBaseUrl}/admin/${email}`,
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
    url: `${apiBaseUrl}/admin/register`,
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
});

Cypress.Commands.add('addUserToken', () => {
  const validUser = {
    username: 'johnny',
    email: 'johnny@gmail.com',
    password: 'johnny123',
  };

  cy.deleteUserByEmail(validUser.email);

  cy.request({
    method: 'POST',
    url: `${apiBaseUrl}/user/register`,
    body: {
      username: validUser.username,
      email: validUser.email,
      password: validUser.password,
    },
    failOnStatusCode: false,
  }).then((signupResponse) => {
    if (signupResponse.status !== 201 && signupResponse.status !== 200) {
      cy.log('User already exists');
    }

    const accessToken = signupResponse.body.accessToken;
    window.localStorage.setItem('accessToken', accessToken);
  });
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

    return cy
      .request({
        method: 'POST',
        url: `${apiBaseUrl}/admin/register`,
        body: {
          username: admin.username,
          email: admin.email,
          password: admin.password,
        },
        failOnStatusCode: false,
      })
      .then((signupResponse) => {
        if (signupResponse.status !== 201 && signupResponse.status !== 200) {
          cy.log('Admin may already exist, proceeding to login');
        }

        cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/admin/login`,
          body: {
            email: admin.email,
            password: admin.password,
          },
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(200);
          expect(loginResponse.body).to.have.property('adminToken');

          const adminToken = loginResponse.body.adminToken;

          // return { adminToken };
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
      url: `${apiBaseUrl}/user/register`,
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
        url: `${apiBaseUrl}/user/login`,
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

Cypress.Commands.add('getUserId', () => {
  const accessToken = window.localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('User token not found. Please login as user first.');
  }

  cy.request({
    method: 'GET',
    url: `${apiBaseUrl}/user`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    const userData = response.body.userData.userId;

    return userData;
  });
});
