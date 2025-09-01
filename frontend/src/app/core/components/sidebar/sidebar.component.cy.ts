import { SidebarComponent } from './sidebar.component';
import { LocalStorageService } from '../../../services/localStorage.service';
import { RegisterService } from '../../../services/register.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../../app.routes';

describe('SidebarComponent', () => {
  let mockLocalStorageService: any;
  let mockRegisterService: any;

  beforeEach(() => {
    mockLocalStorageService = {
      isAdmin: cy.stub(),
      clear: cy.stub(),
    };

    mockRegisterService = {
      getAdmin: cy.stub().returns(of({ adminData: { username: 'adminUser' } })),
      getUser: cy.stub().returns(of({ userData: { username: 'regularUser' } })),
    };

    mockLocalStorageService.isAdmin.returns(false);
  });

  const mountComponent = (isAdmin = false, initialRoute = '') => {
    mockLocalStorageService.isAdmin.returns(isAdmin);

    cy.mount(SidebarComponent, {
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: RegisterService, useValue: mockRegisterService },
        provideRouter(routes),
      ],
    }).then(() => {
      if (initialRoute) {
        cy.window().then((win) => {
          const router = (win as any).ng.getInjector().get(Router);
          router.navigateByUrl(initialRoute);
        });
      }
    });
  };

  describe('User Role Display', () => {
    it('should show admin username when user is admin', () => {
      mountComponent(true);
      cy.contains('.fs-4', 'Welcome adminUser').should('exist');
    });

    it('should show regular username when user is not admin', () => {
      mountComponent(false);
      cy.contains('.fs-4', 'Welcome regularUser').should('exist');
    });
  });

  describe('Navigation Links - Admin', () => {
    beforeEach(() => {
      mountComponent(true);
    });

    it('should show admin navigation links', () => {
      cy.get('.nav-link').should('have.length', 3);
      cy.contains('.nav-link', 'Dashboard').should('exist');
      cy.contains('.nav-link', 'Events').should('exist');
      cy.contains('.nav-link', 'Bookings').should('exist');
    });
  });

  describe('Navigation Links - Regular User', () => {
    beforeEach(() => {
      mountComponent(false);
    });

    it('should show user navigation links', () => {
      cy.get('.nav-link').should('have.length', 3);
      cy.contains('.nav-link', 'Dashboard').should('exist');
      cy.contains('.nav-link', 'Events').should('exist');
      cy.contains('.nav-link', 'Bookings').should('exist');
    });
  });

  describe('User Dropdown', () => {
    it('should display user dropdown', () => {
      mountComponent();
      cy.get('.dropdown-toggle').click();
      cy.get('.dropdown-menu').should('be.visible');
      cy.contains('.dropdown-item', 'Settings').should('exist');
      cy.contains('.dropdown-item', 'Sign out').should('exist');
    });

    it('should call logout when sign out is clicked', () => {
      mountComponent();
      cy.get('.dropdown-toggle').click();
      cy.contains('.dropdown-item', 'Sign out').click();
      cy.wrap(mockLocalStorageService.clear).should('have.been.calledOnce');
    });

    it('should navigate to admin login when admin signs out', () => {
      mountComponent(true);
      cy.get('.dropdown-toggle').click();
      cy.contains('.dropdown-item', 'Sign out').click();
    });
  });

  describe('Visual Elements', () => {
    it('should have correct sidebar styling', () => {
      mountComponent();
      cy.get('.bg-dark').should('exist');
      cy.get('.vh-100').should('exist');
      cy.get('hr').should('have.length', 3);
    });

    it('should display user avatar', () => {
      mountComponent();
      cy.get('img.rounded-circle')
        .should('exist')
        .and('have.attr', 'src', 'https://github.com/mdo.png');
    });
  });
});
