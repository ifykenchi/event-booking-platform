import { CardComponent } from './card.component';
import { LocalStorageService } from '../../../services/localStorage.service';
import { EventI } from '../../../interfaces/services.interfaces';

describe('CardComponent', () => {
  const mockEventData: EventI = {
    _id: 'event-123',
    title: 'Test Event',
    about: 'This is a test event description',
    totalSeats: 100,
    availableSeats: 75,
    category: 'Tech',
    price: 1000,
    createdOn: '2023-01-01',
  };

  let mockLocalStorageService: any;

  beforeEach(() => {
    mockLocalStorageService = {
      isAdmin: cy.stub().returns(false),
    };

    cy.mount(CardComponent, {
      componentProperties: {
        eventData: mockEventData,
        availableSeats: mockEventData.availableSeats,
      },
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });
  });

  it('should display correct event information', () => {
    cy.get('.card-title').should('contain', 'Test Event');
    cy.get('.badge.text-bg-warning').should('contain', 'Tech');
    cy.get('.card-text').should('contain', 'This is a test event description');
  });

  it('should display correct price information', () => {
    cy.get('.badge.text-bg-info').first().should('contain', 'Price: ₦1,000.00');

    cy.mount(CardComponent, {
      componentProperties: {
        eventData: { ...mockEventData, price: 0 },
        availableSeats: mockEventData.availableSeats,
      },
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });
    cy.get('.badge.text-bg-info').first().should('contain', 'Free');
  });

  it('should display correct seat availability', () => {
    cy.get('.badge.text-bg-info')
      .eq(1)
      .should('contain', 'available seats: 75/100');
  });

  describe('User Roles', () => {
    it('should show Book button for non-admin users', () => {
      cy.get('.btn-success').should('contain', 'Book Event');
      cy.get('.btn-primary').should('not.exist');
      cy.get('.btn-danger').should('not.exist');
    });

    it('should show Edit and Delete buttons for admin users', () => {
      mockLocalStorageService.isAdmin.returns(true);
      cy.mount(CardComponent, {
        componentProperties: {
          eventData: mockEventData,
          availableSeats: mockEventData.availableSeats,
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.btn-primary').should('contain', 'Edit');
      cy.get('.btn-danger').should('contain', 'Delete');
      cy.get('.btn-success').should('not.exist');
    });
  });

  describe('Event Emissions', () => {
    it('should emit bookClick when Book button is clicked', () => {
      const bookSpy = cy.spy().as('bookSpy');
      cy.mount(CardComponent, {
        componentProperties: {
          eventData: mockEventData,
          availableSeats: mockEventData.availableSeats,
          bookClick: {
            emit: bookSpy,
          } as any,
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.btn-success').click();
      cy.get('@bookSpy').should('have.been.calledOnceWith', 'event-123');
    });

    it('should emit editClick when Edit button is clicked', () => {
      mockLocalStorageService.isAdmin.returns(true);
      const editSpy = cy.spy().as('editSpy');
      cy.mount(CardComponent, {
        componentProperties: {
          eventData: mockEventData,
          availableSeats: mockEventData.availableSeats,
          editClick: {
            emit: editSpy,
          } as any,
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.btn-primary').click();
      cy.get('@editSpy').should('have.been.calledOnceWith', mockEventData);
    });

    it('should emit deleteClick when Delete button is clicked', () => {
      mockLocalStorageService.isAdmin.returns(true);
      const deleteSpy = cy.spy().as('deleteSpy');
      cy.mount(CardComponent, {
        componentProperties: {
          eventData: mockEventData,
          availableSeats: mockEventData.availableSeats,
          deleteClick: {
            emit: deleteSpy,
          } as any,
        },
        providers: [
          { provide: LocalStorageService, useValue: mockLocalStorageService },
        ],
      });

      cy.get('.btn-danger').click();
      cy.get('@deleteSpy').should('have.been.calledOnceWith', 'event-123');
    });
  });

  describe('Visual Elements', () => {
    it('should have correct card styling', () => {
      cy.get('.card').should('have.css', 'width', '288px');
      cy.get('.card-body').should('exist');
    });

    it('should display all badges with correct styling', () => {
      cy.get('.badge.rounded-pill').should('have.length', 3);
      cy.get('.badge.text-bg-warning').should('exist');
      cy.get('.badge.text-bg-info').should('have.length', 2);
    });
  });
});
