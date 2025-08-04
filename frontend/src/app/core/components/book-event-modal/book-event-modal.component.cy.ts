import { BookEventModalComponent } from './book-event-modal.component';

describe('BookEventModalComponent', () => {
  beforeEach(() => {
    cy.mount(BookEventModalComponent, {
      componentProperties: {
        showBookingModal: true,
        eventId: 'event-123',
        userId: 'user-456',
      },
    });
  });

  it('should not display modal when showBookingModal is false', () => {
    cy.mount(BookEventModalComponent, {
      componentProperties: {
        showBookingModal: false,
      },
    });

    cy.get('.modal').should('not.be.visible');
    cy.get('.modal').should('have.css', 'display', 'none');
  });

  it('should display modal when showBookingModal is true', () => {
    cy.get('.modal').should('be.visible');
    cy.get('.modal').should('have.css', 'display', 'block');
    cy.get('.modal').should('have.class', 'show');
  });

  describe('Form Validation', () => {
    it('should have disabled submit button when form is invalid', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should validate fullName field', () => {
      cy.get('#fullName').type('a').clear().blur();
      cy.get('.alert-danger').should('contain', 'fullName is required');

      cy.get('#fullName').type('ab').blur();
      cy.get('.alert-danger').should(
        'contain',
        'fullName must be at least 3 characters'
      );

      cy.get('#fullName').clear().type('a'.repeat(101)).blur();
      cy.get('.alert-danger').should(
        'contain',
        'fullName cannot exceed 100 characters'
      );

      cy.get('#fullName').clear().type('John Doe').blur();
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate email field', () => {
      cy.get('#email').type('a').clear().blur();
      cy.get('.alert-danger').should('contain', 'email is required');

      cy.get('#email').type('invalid-email').blur();
      cy.get('.alert-danger').should('contain', 'invalid email format');

      cy.get('#email').clear().type('a'.repeat(255)).blur();
      cy.get('.alert-danger').should(
        'contain',
        'email cannot exceed 254 characters'
      );

      cy.get('#email').clear().type('valid@example.com').blur();
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate phoneNumber field', () => {
      cy.get('#phoneNumber').type('a').clear().blur();
      cy.get('.alert-danger').should('contain', 'phoneNumber is required');

      cy.get('#phoneNumber').type('abc').blur();
      cy.get('.alert-danger').should(
        'contain',
        'Format: +1234567890 (6-20 chars)'
      );

      cy.get('#phoneNumber').clear().type('12345').blur();
      cy.get('.alert-danger').should(
        'contain',
        'Format: +1234567890 (6-20 chars)'
      );

      cy.get('#phoneNumber').clear().type('+123456789012345678901').blur();
      cy.get('.alert-danger').should(
        'contain',
        'Format: +1234567890 (6-20 chars)'
      );

      cy.get('#phoneNumber').clear().type('+1234567890').blur();
      cy.get('.alert-danger').should('not.exist');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      cy.get('#fullName').type('John Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phoneNumber').type('+1234567890');
    });

    it('should enable submit button when form is valid', () => {
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should emit bookClick event with form data when submitted', () => {
      const bookClickSpy = cy.spy().as('bookClickSpy');

      cy.mount(BookEventModalComponent, {
        componentProperties: {
          showBookingModal: true,
          eventId: 'event-123',
          userId: 'user-456',
          bookClick: {
            emit: bookClickSpy,
          } as any,
        },
      }).then(() => {
        cy.get('#fullName').type('John Doe');
        cy.get('#email').type('john@example.com');
        cy.get('#phoneNumber').type('+1234567890');

        cy.get('form').submit();
        cy.get('@bookClickSpy').should('have.been.calledOnce');
        cy.get('@bookClickSpy').should('have.been.calledWith', {
          eventId: 'event-123',
          userId: 'user-456',
          userDetails: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '+1234567890',
          },
        });
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should emit closeBookingModal event when close button is clicked', () => {
      const closeSpy = cy.spy().as('closeSpy');

      cy.mount(BookEventModalComponent, {
        componentProperties: {
          showBookingModal: true,
          closeBookingModal: {
            emit: closeSpy,
          } as any,
        },
      });

      cy.get('.btn-danger').click();
      cy.get('@closeSpy').should('have.been.calledOnce');
    });

    it('should reset form when modal is closed', () => {
      cy.get('#fullName').type('John Doe');
      cy.get('#email').type('john@example.com');

      cy.get('.btn-danger').click();

      cy.mount(BookEventModalComponent, {
        componentProperties: {
          showBookingModal: true,
        },
      });

      cy.get('#fullName').should('have.value', '');
      cy.get('#email').should('have.value', '');
    });
  });
});
