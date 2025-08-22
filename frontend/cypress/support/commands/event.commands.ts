/// <reference types="cypress" />

import { apiBaseUrl } from '../constants';

declare global {
  namespace Cypress {
    interface Chainable {
      deleteEventByTitle(eventTitle: string): Chainable<void>;
      createEvent(mockEvent: {
        title: string;
        about: string;
        totalSeats: number;
        category: string;
        price: number;
      }): Chainable<void>;
      getEventIdByTitle(eventTitle: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add('deleteEventByTitle', (eventTitle: string) => {
  const adminToken = window.localStorage.getItem('adminToken');

  if (!adminToken) {
    throw new Error('Admin token not found. Please login as admin first.');
  }

  cy.request({
    method: 'GET',
    url: `${apiBaseUrl}/admin/events`,
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
      url: `${apiBaseUrl}/admin/delete/${eventToDelete._id}`,
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
      url: `${apiBaseUrl}/admin/event`,
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

Cypress.Commands.add('getEventIdByTitle', (eventTitle: string) => {
  const accessToken = window.localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('User token not found. Please login as user first.');
  }

  cy.request({
    method: 'GET',
    url: `${apiBaseUrl}/user/events`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    const events = response.body.events;
    const eventToUse = events.find((event: any) => event.title === eventTitle);

    if (!eventToUse) {
      cy.log(`Event with title "${eventTitle}" not found. Nothing to delete.`);
      return;
    }

    return eventToUse._id;
  });
});
