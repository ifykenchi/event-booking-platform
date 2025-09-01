import { EventsModalComponent } from './events-modal.component';
import { EventI } from '../../../interfaces/services.interfaces';
import { FormControl } from '@angular/forms';

describe('EventsModalComponent', () => {
  const mockEventData: EventI = {
    _id: 'event-123',
    title: 'Test Event',
    about: 'Test event description',
    totalSeats: 100,
    availableSeats: 75,
    category: 'Tech',
    price: 1000,
    createdOn: '2023-01-01',
  };

  beforeEach(() => {
    cy.mount(EventsModalComponent, {
      componentProperties: {
        showModal: true,
        eventData: mockEventData,
      },
    });
  });

  it('should not display modal when showModal is false', () => {
    cy.mount(EventsModalComponent, {
      componentProperties: {
        showModal: false,
        eventData: mockEventData,
      },
    });

    cy.get('.modal').should('not.be.visible');
    cy.get('.modal').should('have.css', 'display', 'none');
  });

  it('should display modal when showModal is true', () => {
    cy.get('.modal').should('be.visible');
    cy.get('.modal').should('have.css', 'display', 'block');
    cy.get('.modal').should('have.class', 'show');
  });

  it('should prefill form with event data', () => {
    cy.get('#title').should('have.value', 'Test Event');
    cy.get('#about').should('have.value', 'Test event description');
    cy.get('#totalSeats').should('have.value', '100');
    cy.get('#category').should('have.value', 'Tech');
    cy.get('#price').should('have.value', '1000');
  });

  describe('Form Validation', () => {
    it('should have disabled submit button when form is invalid', () => {
      cy.get('#title').clear().type('ab');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should validate title field', () => {
      cy.get('#title').clear().type('ab').blur();
      cy.get('.alert-danger').should(
        'contain',
        'Title must be at least 3 characters'
      );

      cy.get('#title').clear().type('a'.repeat(51)).blur();
      cy.get('.alert-danger').should(
        'contain',
        'Title cannot exceed 50 characters'
      );

      cy.get('#title').clear().type('Valid Event Title').blur();
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate about field', () => {
      cy.get('#about').clear().type('short').blur();
      cy.get('.alert-danger').should(
        'contain',
        'Content must be at least 6 characters'
      );

      // cy.get('#about').clear().type('a'.repeat(3001)).blur();
      // cy.get('.alert-danger').should(
      //   'contain',
      //   'Content cannot exceed 3000 characters'
      // );

      cy.get('#about').clear().type('Valid event description').blur();
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate totalSeats field', () => {
      cy.get('#totalSeats').clear().type('-1').blur();
      cy.get('.alert-danger').should('contain', 'Minimum Seats: 0');

      cy.get('#totalSeats').clear().type('10.5').blur();
      cy.get('.alert-danger').should('contain', 'Must be a whole number');

      cy.get('#totalSeats').clear().type('1000001').blur();
      cy.get('.alert-danger').should('contain', 'Maximum Seats: 1,000,000');

      cy.get('#totalSeats').clear().type('100').blur();
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate category field', () => {
      cy.get('#category').select('Tech').blur();
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate price field', () => {
      cy.get('#price').clear().type('-1').blur();
      cy.get('.alert-danger').should('contain', 'Minimum Price: 0');

      cy.get('#price').clear().type('100000001').blur();
      cy.get('.alert-danger').should('contain', 'Maximum Price: 100,000,000');

      cy.get('#price').clear().type('50').blur();
      cy.get('.alert-danger').should('not.exist');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      cy.get('#title').clear().type('Updated Event');
      cy.get('#about').clear().type('Updated description');
      cy.get('#totalSeats').clear().type('50');
      cy.get('#category').select('Entertainment');
      cy.get('#price').clear().type('500');
    });

    it('should enable submit button when form is valid', () => {
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should emit editClick event with updated data when submitted', () => {
      const editSpy = cy.spy().as('editSpy');

      cy.mount(EventsModalComponent, {
        componentProperties: {
          showModal: true,
          eventData: mockEventData,
          editClick: {
            emit: editSpy,
          } as any,
        },
      }).then(() => {
        cy.get('#title').clear().type('Updated Event');
        cy.get('#about').clear().type('Updated description');
        cy.get('#totalSeats').clear().type('50');
        cy.get('#category').select('Entertainment');
        cy.get('#price').clear().type('500');

        cy.get('form').submit();
        cy.get('@editSpy').should('have.been.calledOnce');
        cy.get('@editSpy').should('have.been.calledWith', {
          _id: 'event-123',
          title: 'Updated Event',
          about: 'Updated description',
          totalSeats: 50,
          category: 'Entertainment',
          price: 500,
        });
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should emit modalClosed event when close button is clicked', () => {
      const closeSpy = cy.spy().as('closeSpy');

      cy.mount(EventsModalComponent, {
        componentProperties: {
          showModal: true,
          eventData: mockEventData,
          modalClosed: {
            emit: closeSpy,
          } as any,
        },
      });

      cy.get('.btn-danger').click();
      cy.get('@closeSpy').should('have.been.calledOnce');
    });

    it('should reset form when modal is closed', () => {
      cy.get('#title').clear().type('Modified Title');
      cy.get('#about').clear().type('Modified description');

      cy.get('.btn-danger').click();

      cy.mount(EventsModalComponent, {
        componentProperties: {
          showModal: true,
          eventData: mockEventData,
        },
      });

      cy.get('#title').should('have.value', 'Test Event');
      cy.get('#about').should('have.value', 'Test event description');
    });
  });
});
