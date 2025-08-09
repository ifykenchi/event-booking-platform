// import { AdminLoginComponent } from './admin-login.component';
// import { RegisterService } from '../../../services/register.service';
// import { NotificationService } from '../../../services/notification.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { of, throwError } from 'rxjs';
// import { provideRouter } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { routes } from '../../../app.routes';

// describe('AdminLoginComponent', () => {
//   let mockRegisterService: any;
//   let mockNotificationService: any;
//   let mockRouter: any;

//   beforeEach(() => {
//     mockRegisterService = {
//       adminLogin: cy.stub().as('adminLogin'),
//     };

//     mockNotificationService = {
//       showSuccess: cy.stub().as('showSuccess'),
//       showError: cy.stub().as('showError'),
//     };

//     mockRouter = {
//       navigate: cy.stub().as('navigate'),
//     };

//     cy.mount(AdminLoginComponent, {
//       imports: [ReactiveFormsModule],
//       providers: [
//         { provide: RegisterService, useValue: mockRegisterService },
//         { provide: NotificationService, useValue: mockNotificationService },
//         { provide: Router, useValue: mockRouter },
//         provideRouter(routes),
//       ],
//     });
//   });

//   it('should create', () => {
//     cy.get('h1').should('contain', 'Admin Login');
//     cy.get('form').should('exist');
//   });

//   describe('Form Validation', () => {
//     it('should validate email field', () => {
//       // Test required validation
//       cy.get('#email').focus().blur();
//       cy.contains('Email is required.').should('be.visible');

//       // Test email format validation
//       cy.get('#email').type('invalid-email');
//       cy.contains('Please enter a valid email.').should('be.visible');

//       // Test max length validation
//       cy.get('#email')
//         .clear()
//         .type('a'.repeat(31) + '@test.com');
//       cy.contains('Email cannot exceed 30 characters.').should('be.visible');

//       // Test valid email
//       cy.get('#email').clear().type('valid@email.com');
//       cy.get('.alert-danger').should('not.exist');
//     });

//     it('should validate password field', () => {
//       // Test required validation
//       cy.get('#password').focus().blur();
//       cy.contains('Password is required.').should('be.visible');

//       // Test min length validation
//       cy.get('#password').type('12345');
//       cy.contains('Password must be at least 6 characters long').should(
//         'be.visible'
//       );

//       // Test max length validation
//       cy.get('#password').clear().type('a'.repeat(31));
//       cy.contains('Password cannot exceed 30 characters.').should('be.visible');

//       // Test valid password
//       cy.get('#password').clear().type('validpassword');
//       cy.get('.alert-danger').should('not.exist');
//     });

//     it('should disable submit button when form is invalid', () => {
//       cy.get('button[type="submit"]').should('be.disabled');

//       // Partially valid form
//       cy.get('#email').type('valid@email.com');
//       cy.get('button[type="submit"]').should('be.disabled');

//       // Fully valid form
//       cy.get('#password').type('validpassword');
//       cy.get('button[type="submit"]').should('not.be.disabled');
//     });
//   });

//   describe('Form Submission', () => {
//     const validCredentials = {
//       email: 'admin@test.com',
//       password: 'validpassword123',
//     };

//     beforeEach(() => {
//       cy.get('#email').type(validCredentials.email);
//       cy.get('#password').type(validCredentials.password);
//     });

//     it('should call login service with form data on valid submission', () => {
//       mockRegisterService.adminLogin.returns(of({}));

//       cy.get('form')
//         .submit()
//         .then(() => {
//           expect(mockRegisterService.adminLogin).to.have.been.calledWith(
//             validCredentials
//           );
//           expect(mockRouter.navigate).to.have.been.calledWith([
//             '/admin/dashboard',
//           ]);
//           expect(mockNotificationService.showSuccess).to.have.been.calledWith(
//             'Logged In'
//           );
//         });
//     });

//     it('should handle login error', () => {
//       const errorResponse = { error: { error: 'Invalid credentials' } };
//       mockRegisterService.adminLogin.returns(throwError(() => errorResponse));

//       cy.get('form')
//         .submit()
//         .then(() => {
//           expect(mockNotificationService.showError).to.have.been.calledWith(
//             'Invalid credentials'
//           );
//         });
//     });

//     it('should reset form after submission', () => {
//       mockRegisterService.adminLogin.returns(of({}));

//       cy.get('form')
//         .submit()
//         .then(() => {
//           cy.get('#email').should('have.value', '');
//           cy.get('#password').should('have.value', '');
//         });
//     });
//   });

//   describe('Navigation Links', () => {
//     it('should have link to admin register page', () => {
//       cy.contains('Sign Up').should(
//         'have.attr',
//         'routerLink',
//         '/admin/register'
//       );
//     });

//     it('should have link to user login page', () => {
//       cy.contains('Login as User').should(
//         'have.attr',
//         'routerLink',
//         '/user/login'
//       );
//     });
//   });
// });
