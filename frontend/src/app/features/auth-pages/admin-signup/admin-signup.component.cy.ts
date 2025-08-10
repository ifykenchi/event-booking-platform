import { AdminSignupComponent } from './admin-signup.component';
import { RegisterService } from '../../../services/register.service';
import { NotificationService } from '../../../services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { of, throwError } from 'rxjs';

describe('AdminSignupComponent', () => {
  let mockRegisterService: {
    adminSignup: Cypress.Agent<sinon.SinonStub>;
  };
  let mockNotificationService: {
    showSuccess: Cypress.Agent<sinon.SinonStub>;
    showError: Cypress.Agent<sinon.SinonStub>;
  };

  beforeEach(() => {
    mockRegisterService = {
      adminSignup: cy.stub().returns(of({})) as any,
    };

    mockNotificationService = {
      showSuccess: cy.stub(),
      showError: cy.stub(),
    };

    cy.mount(AdminSignupComponent, {
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: NotificationService, useValue: mockNotificationService },
        provideRouter(routes),
      ],
    });
  });

  it('should render correctly', () => {
    cy.get('h1').should('contain', 'Admin Signup');
    cy.get('form').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  describe('Form Validation', () => {
    it('should have disabled submit button when form is invalid', () => {
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should validate username field', () => {
      cy.get('#username').type('a').clear().blur();
      cy.contains('Username is required.').should('exist');

      cy.get('#username').type('ab');
      cy.contains('Username must be at least 3 characters long.').should(
        'exist'
      );

      cy.get('#username').clear().type('a'.repeat(31));
      cy.contains('Username cannot exceed 30 characters.').should('exist');

      cy.get('#username').clear().type('validusername');
      cy.get('.alert-danger').should('not.exist');
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
      username: 'testadmin',
      email: 'admin@example.com',
      password: 'validpassword123',
    };

    beforeEach(() => {
      cy.get('#username').type(validAdmin.username);
      cy.get('#email').type(validAdmin.email);
      cy.get('#password').type(validAdmin.password);
    });

    it('should enable submit button when form is valid', () => {
      cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should call adminSignup with form data when submitted', () => {
      cy.get('form').submit();
      cy.wrap(mockRegisterService.adminSignup).should(
        'have.been.calledWith',
        validAdmin
      );
    });

    it('should handle successful signup', () => {
      cy.get('form').submit();
      cy.wrap(mockNotificationService.showSuccess).should(
        'have.been.calledWith',
        'You are Signed Up!'
      );
    });

    it('should handle signup error', () => {
      const errorResponse = {
        error: { error: 'Email already exists' },
      };
      mockRegisterService.adminSignup = cy
        .stub()
        .returns(throwError(() => errorResponse)) as any;

      cy.get('form').submit();
      cy.wrap(mockNotificationService.showError).should(
        'have.been.calledWith',
        'Email already exists'
      );
    });

    it('should reset form after submission', () => {
      cy.get('form').submit();
      cy.get('#username').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#password').should('have.value', '');
    });
  });

  describe('Navigation Links', () => {
    it('should have link to admin login', () => {
      cy.contains('a', 'Log In')
        .should('exist')
        .and('have.attr', 'routerLink', '/admin/login');
    });

    it('should have link to user register', () => {
      cy.contains('a', 'User')
        .should('exist')
        .and('have.attr', 'routerLink', '/user/register');
    });
  });
});
