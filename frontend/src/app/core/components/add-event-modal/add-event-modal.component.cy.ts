import { AddEventModalComponent } from './add-event-modal.component';

describe('AddEventModalComponent', () => {
  beforeEach(() => {
    cy.mount(AddEventModalComponent, {
      componentProperties: {
        showAddModal: true,
      },
    });
  });

  it('should not display modal when showAddModal is false', () => {
    cy.mount(AddEventModalComponent, {
      componentProperties: {
        showAddModal: false,
      },
    });

    cy.get('.modal').should('not.be.visible');
    cy.get('.modal').should('have.css', 'display', 'none');
  });

  it('should display modal when showAddModal is true', () => {
    cy.get('.modal').should('be.visible');
    cy.get('.modal').should('have.css', 'display', 'block');
    cy.get('.modal').should('have.class', 'show');
  });

  describe('Form Validation', () => {
    it('should have disabled submit button when form is invalid', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should validate title field', () => {
      cy.get('#title').type('a').clear().blur();
      cy.get('.alert-danger').should('contain', 'Title is Required');

      cy.get('#title').type('ab').blur();
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
      cy.get('#about').type('a').clear().blur();
      cy.get('.alert-danger').should('contain', 'About content is Required');

      cy.get('#about').type('short').blur();
      cy.get('.alert-danger').should(
        'contain',
        'Content must be at least 6 characters'
      );

      cy.get('#about').clear().type('This is a valid event description').blur();
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
      cy.get('#price').type('1').clear().blur();
      cy.get('.alert-danger').should('contain', 'Price is Required');

      cy.get('#price').clear().type('-1').blur();
      cy.get('.alert-danger').should('contain', 'Minimum Price 0');

      cy.get('#price').clear().type('1000000001').blur();
      cy.get('.alert-danger').should('contain', 'Maximum Price: 100,000,000');

      cy.get('#price').clear().type('50').blur();
      cy.get('.alert-danger').should('not.exist');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      cy.get('#title').type('Test Event');
      cy.get('#about').type('This is a test event description');
      cy.get('#totalSeats').clear().type('100');
      cy.get('#category').select('Tech');
      cy.get('#price').clear().type('50');
    });

    it('should enable submit button when form is valid', () => {
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should emit addClick event with form data when submitted', () => {
      const addClickSpy = cy.spy().as('addClickSpy');

      cy.mount(AddEventModalComponent, {
        componentProperties: {
          showAddModal: true,
          addClick: {
            emit: addClickSpy,
          } as any,
        },
      }).then(() => {
        cy.get('#title').type('Test Event');
        cy.get('#about').type('This is a test event description');
        cy.get('#totalSeats').clear().type('100');
        cy.get('#category').select('Tech');
        cy.get('#price').clear().type('50');

        cy.get('form').submit();
        cy.get('@addClickSpy').should('have.been.calledOnce');
        cy.get('@addClickSpy').should('have.been.calledWith', {
          title: 'Test Event',
          about: 'This is a test event description',
          totalSeats: 100,
          category: 'Tech',
          price: 50,
        });
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should emit closeAddModal event when close button is clicked', () => {
      const closeSpy = cy.spy().as('closeSpy');

      cy.mount(AddEventModalComponent, {
        componentProperties: {
          showAddModal: true,
          closeAddModal: {
            emit: closeSpy,
          } as any,
        },
      });

      cy.get('.btn-danger').click();
      cy.get('@closeSpy').should('have.been.calledOnce');
    });

    it('should reset form when modal is closed', () => {
      cy.get('#title').type('Test Event');
      cy.get('#about').type('Test description');

      cy.get('.btn-danger').click();

      cy.mount(AddEventModalComponent, {
        componentProperties: {
          showAddModal: true,
        },
      });

      cy.get('#title').should('have.value', '');
      cy.get('#about').should('have.value', '');
    });
  });
});
