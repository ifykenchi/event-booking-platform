import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../../services/dashboard.service';
import { of, throwError } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let mockDashboardService: {
    totalEvents: Cypress.Agent<sinon.SinonStub>;
    totalBookings: Cypress.Agent<sinon.SinonStub>;
    mostBookedEvents: Cypress.Agent<sinon.SinonStub>;
    totalRevenue: Cypress.Agent<sinon.SinonStub>;
  };

  const mockMostBookedEvent = {
    _id: 'event123',
    title: 'Popular Event',
    bookingCount: 50,
    about: 'about this current event',
    totalSeats: 200,
    availableSeats: 150,
    category: 'Tech',
    price: 1000,
    createdOn: '12th Nov, 2025',
  };

  beforeEach(() => {
    mockDashboardService = {
      totalEvents: cy.stub().returns(of({ totalEvents: 10 })),
      totalBookings: cy.stub().returns(of({ totalBookings: 100 })),
      mostBookedEvents: cy.stub().returns(
        of({
          mostBookedEvents: [mockMostBookedEvent],
        })
      ),
      totalRevenue: cy.stub().returns(of({ totalRevenue: 50000 })),
    } as any;

    cy.mount(AdminDashboardComponent, {
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    });
  });

  it('should render correctly', () => {
    cy.get('h1').should('contain', 'Event Management Dashboard');
    cy.get('.card').should('have.length', 5);
  });

  it('should load and display dashboard metrics', () => {
    cy.wrap(mockDashboardService.totalEvents).should('have.been.called');
    cy.wrap(mockDashboardService.totalBookings).should('have.been.called');
    cy.wrap(mockDashboardService.mostBookedEvents).should('have.been.called');
    cy.wrap(mockDashboardService.totalRevenue).should('have.been.called');

    cy.contains('.card-title', 'Total Events')
      .siblings('.d-flex')
      .should('contain', '10');

    cy.contains('.card-title', 'Total Bookings')
      .siblings('.d-flex')
      .should('contain', '100');

    cy.contains('.card-title', 'Total Revenue')
      .siblings('.d-flex')
      .should('contain', '₦50,000.00');

    cy.contains('.card-title', 'Top Event(s)')
      .parent()
      .should('contain', 'Popular Event')
      .and('contain', '50 bookings');
  });

  it('should handle empty most booked events', () => {
    mockDashboardService.mostBookedEvents = cy.stub().returns(
      of({
        mostBookedEvents: null,
      })
    ) as any;

    cy.mount(AdminDashboardComponent, {
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    });

    cy.contains('.card-title', 'Top Event(s)')
      .parent()
      .should('not.contain', 'Popular Event')
      .and('not.contain', '50 bookings');

    cy.contains('.card-title', 'Top Event(s)')
      .parent()
      .should('contain', 'No bookings yet');
  });

  describe('Error Handling', () => {
    it('should handle totalEvents error', () => {
      mockDashboardService.totalEvents = cy
        .stub()
        .returns(
          throwError(() => new Error('Failed to load total events'))
        ) as any;

      cy.mount(AdminDashboardComponent, {
        providers: [
          { provide: DashboardService, useValue: mockDashboardService },
        ],
      });

      cy.contains('.card-title', 'Total Events')
        .siblings('.d-flex')
        .should('contain', '0');
    });

    it('should handle totalBookings error', () => {
      mockDashboardService.totalBookings = cy
        .stub()
        .returns(
          throwError(() => new Error('Failed to load total bookings'))
        ) as any;

      cy.mount(AdminDashboardComponent, {
        providers: [
          { provide: DashboardService, useValue: mockDashboardService },
        ],
      });

      cy.contains('.card-title', 'Total Bookings')
        .siblings('.d-flex')
        .should('contain', '0');
    });

    it('should handle mostBookedEvents error', () => {
      mockDashboardService.mostBookedEvents = cy
        .stub()
        .returns(
          throwError(() => new Error('Failed to load most booked events'))
        ) as any;

      cy.mount(AdminDashboardComponent, {
        providers: [
          { provide: DashboardService, useValue: mockDashboardService },
        ],
      });

      cy.contains('.card-title', 'Top Event(s)')
        .parent()
        .should('not.contain', 'Popular Event')
        .and('not.contain', '50 bookings');
    });

    it('should handle totalRevenue error', () => {
      mockDashboardService.totalRevenue = cy
        .stub()
        .returns(
          throwError(() => new Error('Failed to load total revenue'))
        ) as any;

      cy.mount(AdminDashboardComponent, {
        providers: [
          { provide: DashboardService, useValue: mockDashboardService },
        ],
      });

      cy.contains('.card-title', 'Total Revenue')
        .siblings('.d-flex')
        .should('contain', '₦0.00');
    });
  });

  it('should display booking overview section', () => {
    cy.contains('.card-title', 'Bookings Overview').should('exist');
    cy.contains('.chart-placeholder', 'Booking trends visualization').should(
      'exist'
    );
  });
});
