import { AdminLoginComponent } from './admin-login.component';
import { RegisterService } from '../../../services/register.service';
import { NotificationService } from '../../../services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { of, throwError } from 'rxjs';

describe('AdminLoginComponent', () => {
  let mockRegisterService: {
    adminLogin: Cypress.Agent<sinon.SinonStub>;
  };
  let mockNotificationService: {
    showSuccess: Cypress.Agent<sinon.SinonStub>;
    showError: Cypress.Agent<sinon.SinonStub>;
  };

  beforeEach(() => {
    mockRegisterService = {
      adminLogin: cy.stub().returns(of({})) as any,
    };

    mockNotificationService = {
      showSuccess: cy.stub(),
      showError: cy.stub(),
    };

    cy.mount(AdminLoginComponent, {
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: NotificationService, useValue: mockNotificationService },
        provideRouter(routes),
      ],
    });
  });

  it('should render correctly', () => {
    cy.get('h1').should('contain', 'Admin Login');
    cy.get('form').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  describe('Form Validation', () => {
    it('should have disabled submit button when form is invalid', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should validate email field', () => {
      cy.get('#email').type('a').clear().blur();
      cy.contains('Email is required.').should('exist');

      cy.get('#email').type('invalid-email');
      cy.contains('Please enter a valid email.').should('exist');

      cy.get('#email').clear().type('a'.repeat(31));
      cy.contains('Email cannot exceed 30 characters.').should('exist');

      cy.get('#email').clear().type('valid@example.com');
      cy.get('.alert-danger').should('not.exist');
    });

    it('should validate password field', () => {
      cy.get('#password').type('a').clear().blur();
      cy.contains('Password is required.').should('exist');

      cy.get('#password').type('12345');
      cy.contains('Password must be at least 6 characters long').should(
        'exist'
      );

      cy.get('#password').clear().type('a'.repeat(31));
      cy.contains('Password cannot exceed 30 characters.').should('exist');

      cy.get('#password').clear().type('validpassword');
      cy.get('.alert-danger').should('not.exist');
    });
  });

  describe('Form Submission', () => {
    const validAdmin = {
      email: 'admin@example.com',
      password: 'validpassword123',
    };

    beforeEach(() => {
      cy.get('#email').type(validAdmin.email);
      cy.get('#password').type(validAdmin.password);
    });

    it('should enable submit button when form is valid', () => {
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should call adminLogin with form data when submitted', () => {
      cy.get('form').submit();
      cy.wrap(mockRegisterService.adminLogin).should(
        'have.been.calledWith',
        validAdmin
      );
    });

    it('should handle successful login', () => {
      cy.get('form').submit();

      cy.wrap(mockNotificationService.showSuccess).should(
        'have.been.calledWith',
        'Logged In'
      );
    });

    it('should handle login error', () => {
      const errorResponse = {
        error: { error: 'Invalid credentials' },
      };
      mockRegisterService.adminLogin = cy
        .stub()
        .returns(throwError(() => errorResponse)) as any;

      cy.get('form').submit();

      cy.wrap(mockNotificationService.showError).should(
        'have.been.calledWith',
        'Invalid credentials'
      );
    });

    it('should reset form after submission', () => {
      cy.get('form').submit();
      cy.get('#email').should('have.value', '');
      cy.get('#password').should('have.value', '');
    });
  });

  describe('Navigation Links', () => {
    it('should have link to admin register', () => {
      cy.contains('a', 'Sign Up')
        .should('exist')
        .and('have.attr', 'routerLink', '/admin/register');
    });

    it('should have link to user login', () => {
      cy.contains('a', 'User')
        .should('exist')
        .and('have.attr', 'routerLink', '/user/login');
    });
  });
});
