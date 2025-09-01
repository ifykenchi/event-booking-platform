import { NavbarComponent } from './navbar.component';
import { LocalStorageService } from '../../../services/localStorage.service';
import { EventsService } from '../../../services/events.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let mockLocalStorageService: any;
  let mockEventsService: any;

  beforeEach(() => {
    mockLocalStorageService = {
      isAdmin: cy.stub(),
    };

    mockEventsService = {
      searchAdminEvents: cy.stub().returns(of([])),
      searchUserEvents: cy.stub().returns(of([])),
      setFilteredEvents: cy.stub(),
    };

    mockLocalStorageService.isAdmin.returns(false);
  });

  const mountComponent = (isAdmin = false) => {
    mockLocalStorageService.isAdmin.returns(isAdmin);
    cy.mount(NavbarComponent, {
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    });
  };

  describe('User Role Display', () => {
    it('should show "Manage Events" brand for admin users', () => {
      mountComponent(true);
      cy.get('.navbar-brand').should('have.length', 1);
      cy.get('.navbar-brand').should('contain', 'Manage Events');
    });

    it('should show "Events" brand for regular users', () => {
      mountComponent(false);
      cy.get('.navbar-brand').should('have.length', 1);
      cy.get('.navbar-brand').should('contain', 'Events');
    });
  });

  describe('Category Dropdown', () => {
    beforeEach(() => {
      mountComponent();
      cy.get('.navbar-toggler').click();
    });

    it('should display category dropdown', () => {
      cy.get('.dropdown-toggle').should('contain', 'Category');
      cy.get('.dropdown-toggle').click();
      cy.get('.dropdown-item').should('have.length', 5);
    });

    it('should show all category options', () => {
      cy.get('.dropdown-toggle').click();
      cy.contains('.dropdown-item', 'All Events').should('exist');
      cy.contains('.dropdown-item', 'Entertainment').should('exist');
      cy.contains('.dropdown-item', 'Football').should('exist');
      cy.contains('.dropdown-item', 'Tech').should('exist');
      cy.contains('.dropdown-item', 'Others').should('exist');
    });
  });

  describe('Category Filtering', () => {
    const testCategories = [
      { name: 'ALL', label: 'All Events' },
      { name: 'Entertainment', label: 'Entertainment' },
      { name: 'Football', label: 'Football' },
      { name: 'Tech', label: 'Tech' },
      { name: 'Others', label: 'Others' },
    ];

    testCategories.forEach(({ name, label }) => {
      it(`should call correct service for ${label} filter (regular user)`, () => {
        mountComponent(false);
        cy.get('.navbar-toggler').click();
        cy.get('.dropdown-toggle').click();
        cy.contains('.dropdown-item', label).click();

        cy.wrap(mockEventsService.searchUserEvents).should(
          'have.been.calledOnceWith',
          'category',
          name
        );
        cy.wrap(mockEventsService.setFilteredEvents).should(
          'have.been.calledOnce'
        );
      });

      it(`should call correct service for ${label} filter (admin user)`, () => {
        mountComponent(true);
        cy.get('.navbar-toggler').click();
        cy.get('.dropdown-toggle').click();
        cy.contains('.dropdown-item', label).click();

        cy.wrap(mockEventsService.searchAdminEvents).should(
          'have.been.calledOnceWith',
          'category',
          name
        );
        cy.wrap(mockEventsService.setFilteredEvents).should(
          'have.been.calledOnce'
        );
      });
    });
  });

  describe('Mobile View', () => {
    it('should show navbar toggler button', () => {
      mountComponent();
      cy.get('.navbar-toggler').should('exist');
      cy.get('.navbar-toggler-icon').should('exist');
    });

    it('should collapse navbar on mobile', () => {
      cy.viewport(500, 800);
      mountComponent();
      cy.get('#navbarSupportedContent').should('not.have.class', 'show');
    });
  });
});
