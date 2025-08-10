// import { ManEventsComponent } from './man-events.component';
// import { EventsService } from '../../../services/events.service';
// import { NotificationService } from '../../../services/notification.service';
// import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
// import { CardComponent } from '../../../core/components/card/card.component';
// import { EventsModalComponent } from '../../../core/components/events-modal/events-modal.component';
// import { AddEventModalComponent } from '../../../core/components/add-event-modal/add-event-modal.component';
// import { ConfirmationModalComponent } from '../../../core/components/confirmation-modal/confirmation-modal.component';
// import { of, throwError } from 'rxjs';

// describe('ManEventsComponent', () => {
//   const mockEvent = {
//     _id: 'event123',
//     title: 'Test Event',
//     about: 'Test event description',
//     totalSeats: 100,
//     availableSeats: 80,
//     category: 'Tech',
//     price: 1000,
//     createdOn: '2023-01-01',
//   };

//   let mockEventsService: {
//     getAdminEvents: Cypress.Agent<sinon.SinonStub>;
//     deleteAdminEvent: Cypress.Agent<sinon.SinonStub>;
//     refreshAdminEvents: Cypress.Agent<sinon.SinonStub>;
//     editAdminEvent: Cypress.Agent<sinon.SinonStub>;
//     addAdminEvent: Cypress.Agent<sinon.SinonStub>;
//     filteredEvents$: any;
//   };

//   let mockNotificationService: {
//     showSuccess: Cypress.Agent<sinon.SinonStub>;
//     showError: Cypress.Agent<sinon.SinonStub>;
//   };

//   beforeEach(() => {
//     mockEventsService = {
//       getAdminEvents: cy
//         .stub()
//         .returns(of({ message: 'success', events: [mockEvent] })),
//       deleteAdminEvent: cy.stub().returns(of({})),
//       refreshAdminEvents: cy.stub(),
//       editAdminEvent: cy.stub().returns(of({})),
//       addAdminEvent: cy.stub().returns(of({})),
//       filteredEvents$: of([mockEvent]),
//     } as any;

//     mockNotificationService = {
//       showSuccess: cy.stub(),
//       showError: cy.stub(),
//     };

//     cy.mount(ManEventsComponent, {
//       imports: [
//         NavbarComponent,
//         CardComponent,
//         EventsModalComponent,
//         AddEventModalComponent,
//         ConfirmationModalComponent,
//       ],
//       providers: [
//         { provide: EventsService, useValue: mockEventsService },
//         { provide: NotificationService, useValue: mockNotificationService },
//       ],
//     });
//   });

//   it('should render correctly', () => {
//     cy.get('app-navbar').should('exist');
//     cy.contains('button', 'Add Event').should('exist');
//     cy.get('app-card').should('have.length', 1);
//   });

//   it('should load and display events', () => {
//     cy.wrap(mockEventsService.getAdminEvents).should('have.been.called');
//     cy.get('app-card').should('contain', 'Test Event');
//     cy.get('app-card').should('contain', 'Tech');
//   });

//   it('should show empty state when no events', () => {
//     mockEventsService.getAdminEvents = cy
//       .stub()
//       .returns(of({ events: [] })) as any;
//     mockEventsService.filteredEvents$ = of([]);

//     cy.mount(ManEventsComponent, {
//       imports: [
//         NavbarComponent,
//         CardComponent,
//         EventsModalComponent,
//         AddEventModalComponent,
//         ConfirmationModalComponent,
//       ],
//       providers: [
//         { provide: EventsService, useValue: mockEventsService },
//         { provide: NotificationService, useValue: mockNotificationService },
//       ],
//     });

//     cy.get('app-card').should('not.exist');
//   });

//   describe('Add Event', () => {
//     it('should open add modal when button clicked', () => {
//       cy.contains('button', 'Add Event').click();
//       cy.get('app-add-event-modal').should('exist');
//     });

//     it('should close add modal', () => {
//       cy.contains('button', 'Add Event').click();
//       cy.get('[data-cy="close-add-modal-btn"]').click();
//       cy.get('app-add-event-modal')
//         .get('.modal')
//         .should('have.css', 'display', 'none');
//       cy.get('app-add-event-modal').get('.modal').should('not.be.visible');
//     });

//     it('should add event when form submitted', () => {
//       const newEvent = { ...mockEvent, title: 'New Event' };

//       cy.contains('button', 'Add Event').click();
//       cy.get('[data-cy="event-title-input"]').type(newEvent.title);
//       cy.get('[data-cy="event-about-input"]').type(newEvent.about);
//       cy.get('[data-cy="event-totalSeats-input"]').type(
//         newEvent.totalSeats.toString()
//       );
//       cy.get('[data-cy="event-category-input"]').select(newEvent.category);
//       cy.get('[data-cy="event-price-input"]').type(newEvent.price.toString());

//       cy.get('[data-cy="submit-add-event-btn"]').click();

//       cy.wrap(mockEventsService.addAdminEvent).should('have.been.called');
//       cy.wrap(mockEventsService.refreshAdminEvents).should('have.been.called');
//       cy.wrap(mockNotificationService.showSuccess).should(
//         'have.been.calledWith',
//         'Event created'
//       );
//     });
//   });

//   describe('Edit Event', () => {
//     it('should open edit modal when edit button clicked', () => {
//       cy.get('app-card').first().find('[data-cy="edit-event-btn"]').click();
//       cy.get('app-events-modal').should('exist');
//     });

//     //   it('should close edit modal', () => {
//     //     cy.get('app-card').first().find('[data-cy="edit-event-btn"]').click();
//     //     cy.get('[data-cy="close-events-modal-btn"]').click();
//     //     cy.get('app-events-modal').should('not.exist');
//     //   });

//     //   it('should edit event when form submitted', () => {
//     //     const updatedEvent = { ...mockEvent, title: 'Updated Event' };

//     //     cy.get('app-card').first().find('[data-cy="edit-event-btn"]').click();
//     //     // Simulate editing the form in the events-modal component
//     //     cy.get('[data-cy="event-title-input"]').clear().type(updatedEvent.title);
//     //     // ... modify other fields as needed

//     //     cy.get('[data-cy="submit-edit-event-btn"]').click();

//     //     cy.wrap(mockEventsService.editAdminEvent).should(
//     //       'have.been.calledWith',
//     //       mockEvent._id,
//     //       updatedEvent
//     //     );
//     //     cy.wrap(mockEventsService.refreshAdminEvents).should('have.been.called');
//     //     cy.wrap(mockNotificationService.showSuccess).should(
//     //       'have.been.calledWith',
//     //       'Event updated'
//     //     );
//     //   });
//   });

//   //   describe('Delete Event', () => {
//   //     it('should open confirmation modal when delete clicked', () => {
//   //       cy.get('app-card').first().find('[data-cy="delete-event-btn"]').click();
//   //       cy.get('app-confirmation-modal').should('exist');
//   //       cy.contains('This is irreversible. Are you sure you want to delete?');
//   //     });

//   //     it('should close confirmation modal when cancelled', () => {
//   //       cy.get('app-card').first().find('[data-cy="delete-event-btn"]').click();
//   //       cy.get('[data-cy="confirmModal-close-btn"]').click();
//   //       cy.get('app-confirmation-modal').should('not.exist');
//   //     });

//   //     it('should delete event when confirmed', () => {
//   //       cy.get('app-card').first().find('[data-cy="delete-event-btn"]').click();
//   //       cy.get('[data-cy="confirmModal-modalType-btn"]').click();

//   //       cy.wrap(mockEventsService.deleteAdminEvent).should(
//   //         'have.been.calledWith',
//   //         mockEvent._id
//   //       );
//   //       cy.wrap(mockEventsService.refreshAdminEvents).should('have.been.called');
//   //       cy.wrap(mockNotificationService.showSuccess).should(
//   //         'have.been.calledWith',
//   //         'Event Deleted'
//   //       );
//   //     });

//   //     it('should show error when delete fails', () => {
//   //       mockEventsService.deleteAdminEvent = cy
//   //         .stub()
//   //         .returns(throwError(() => new Error('Delete failed'))) as any;

//   //       cy.get('app-card').first().find('[data-cy="delete-event-btn"]').click();
//   //       cy.get('[data-cy="confirmModal-modalType-btn"]').click();

//   //       cy.wrap(mockNotificationService.showError).should(
//   //         'have.been.calledWith',
//   //         'An error occured. Please try again'
//   //       );
//   //     });
//   //   });
// });
