import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  it('should not display modal when showConfirmModal is false', () => {
    cy.mount(ConfirmationModalComponent, {
      componentProperties: {
        showConfirmModal: false,
      },
    });

    cy.get('.modal').should('not.be.visible');
    cy.get('.modal').should('have.css', 'display', 'none');
  });

  it('should display modal when showConfirmModal is true', () => {
    cy.mount(ConfirmationModalComponent, {
      componentProperties: {
        showConfirmModal: true,
        message: 'Test message',
        modalType: 'Confirm',
      },
    });

    cy.get('.modal').should('be.visible');
    cy.get('.modal').should('have.css', 'display', 'block');
    cy.get('.modal').should('have.class', 'show');
    cy.get('.modal-body p').should('contain.text', 'Test message');
    cy.get('.btn-primary').should('contain.text', 'Confirm');
  });

  it('should display correct button text based on modalType input', () => {
    cy.mount(ConfirmationModalComponent, {
      componentProperties: {
        showConfirmModal: true,
        modalType: 'Delete',
      },
    });

    cy.get('.btn-primary').should('contain.text', 'Delete');
  });

  it('should emit confirmClick event when confirm button is clicked', () => {
    const confirmSpy = cy.spy().as('confirmSpy');

    cy.mount(ConfirmationModalComponent, {
      componentProperties: {
        showConfirmModal: true,
        confirmClick: {
          emit: confirmSpy,
        } as any,
      },
    });

    cy.get('.btn-primary').click();
    cy.get('@confirmSpy').should('have.been.calledOnce');
  });

  it('should emit closeModal event when close button is clicked', () => {
    const closeSpy = cy.spy().as('closeSpy');

    cy.mount(ConfirmationModalComponent, {
      componentProperties: {
        showConfirmModal: true,
        closeModal: {
          emit: closeSpy,
        } as any,
      },
    });

    cy.get('.btn-danger').click();
    cy.get('@closeSpy').should('have.been.calledOnce');
  });

  it('should apply correct CSS classes when visible', () => {
    cy.mount(ConfirmationModalComponent, {
      componentProperties: {
        showConfirmModal: true,
      },
    });

    cy.get('.modal').should('have.class', 'fade').should('have.class', 'show');

    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-content').should('exist');
    cy.get('.modal-body').should('exist');
  });
});
