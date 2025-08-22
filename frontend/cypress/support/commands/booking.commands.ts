/// <reference types="cypress" />

import { apiBaseUrl } from '../constants';

declare global {
  namespace Cypress {
    interface Chainable {
      deleteBookingByEmail(email: string): Chainable<void>;
      addBooking(
        eventId: string,
        userId: string,
        userDetails: { fullName: string; email: string; phoneNumber: string }
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add('deleteBookingByEmail', (email: string) => {
  const adminToken = window.localStorage.getItem('adminToken');

  if (!adminToken) {
    throw new Error('Admin token not found. Please login as admin first.');
  }

  cy.request({
    method: 'GET',
    url: `${apiBaseUrl}/admin/bookings`,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    const bookings = response.body.bookings;
    const bookingToDelete = bookings.find(
      (booking: any) => booking.userDetails.email === email
    );

    if (!bookingToDelete) {
      cy.log(`Booking email: "${email}" not found. Nothing to delete.`);
      return;
    }

    cy.request({
      method: 'DELETE',
      url: `${apiBaseUrl}/admin/booking/${bookingToDelete._id}`,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }).then((deleteResponse) => {
      console.log('status code: ', deleteResponse.status);
      expect(deleteResponse.status).to.be.oneOf([200, 204]);
      cy.log(`Successfully deleted booking with registered email: ${email}`);
    });
  });
});

Cypress.Commands.add(
  'addBooking',
  (
    eventId: string,
    userId: string,
    userDetails: { fullName: string; email: string; phoneNumber: string }
  ) => {
    const accessToken = window.localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('User token not found. Please login as user first.');
    }

    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/user/booking`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: { eventId, userId, userDetails },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  }
);
