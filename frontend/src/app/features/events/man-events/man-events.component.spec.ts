import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManEventsComponent } from './man-events.component';
import { EventsService } from '../../../services/events.service';
import { NotificationService } from '../../../services/notification.service';
import { of, throwError } from 'rxjs';
import { EventI } from '../../../interfaces/services.interfaces';

describe('ManEventsComponent', () => {
  let component: ManEventsComponent;
  let fixture: ComponentFixture<ManEventsComponent>;
  let mockEventsService: jasmine.SpyObj<EventsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockEvents: EventI[] = [
    {
      _id: '1',
      title: 'Event 1',
      about: 'Description 1',
      totalSeats: 100,
      category: 'Tech',
      price: 1000,
      createdOn: '12th nov, 2025',
    },
    {
      _id: '2',
      title: 'Event 2',
      about: 'Description 2',
      totalSeats: 200,
      category: 'Tech',
      price: 1000,
      createdOn: '12th nov, 2025',
    },
  ];

  beforeEach(async () => {
    mockEventsService = jasmine.createSpyObj('EventsService', [
      'getAdminEvents',
      'deleteAdminEvent',
      'editAdminEvent',
      'addAdminEvent',
      'refreshAdminEvents',
      'filteredEvents$',
    ]);

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [ManEventsComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManEventsComponent);
    component = fixture.componentInstance;

    mockEventsService.getAdminEvents.and.returnValue(
      of({ message: 'success', events: mockEvents })
    );
    mockEventsService.filteredEvents$ = of(mockEvents);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on initialization', () => {
    expect(mockEventsService.getAdminEvents).toHaveBeenCalled();
    expect(component.events).toEqual(mockEvents);
  });

  it('should handle error when initialization fails', () => {
    const errorMessage = 'Failed to load events!';
    const mockError = new Error('Load failed');
    mockEventsService.getAdminEvents.and.returnValue(
      throwError(() => mockError)
    );
    spyOn(console, 'error');

    component.ngOnInit();

    expect(mockEventsService.getAdminEvents).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(errorMessage, mockError);
  });

  describe('handleDelete', () => {
    it('should set showConfirmModal to true and set targetEventId', () => {
      const eventId = '123';
      component.handleDelete(eventId);

      expect(component.showConfirmModal).toBeTrue();
      expect(component.targetEventId).toBe(eventId);
    });
  });

  describe('handleConfirmDelete', () => {
    it('should delete event and refresh events on success', () => {
      const eventId = '123';
      component.targetEventId = eventId;
      mockEventsService.deleteAdminEvent.and.returnValue(
        of({ message: 'success' })
      );

      component.handleConfirmDelete();

      expect(mockEventsService.deleteAdminEvent).toHaveBeenCalledWith(eventId);
      expect(mockEventsService.refreshAdminEvents).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Event Deleted'
      );
      expect(component.showConfirmModal).toBeFalse();
    });

    it('should handle error when deleting event fails', () => {
      const eventId = '123';
      component.targetEventId = eventId;
      mockEventsService.deleteAdminEvent.and.returnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.handleConfirmDelete();

      expect(mockEventsService.deleteAdminEvent).toHaveBeenCalledWith(eventId);
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'An error occured. Please try again'
      );
    });
  });

  describe('showEventsModal', () => {
    it('should set showModal to true and set eventData', () => {
      const eventData = mockEvents[0];
      component.showEventsModal(eventData);

      expect(component.showModal).toBeTrue();
      expect(component.eventData).toBe(eventData);
    });
  });

  describe('handleEdit', () => {
    it('should edit event and refresh events on success', () => {
      const updatedEvent = { _id: '1', title: 'Updated Event' } as any;
      mockEventsService.editAdminEvent.and.returnValue(
        of({ message: 'success', events: updatedEvent })
      );

      component.handleEdit(updatedEvent);

      expect(mockEventsService.editAdminEvent).toHaveBeenCalledWith(
        updatedEvent._id,
        updatedEvent
      );
      expect(mockEventsService.refreshAdminEvents).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Event updated'
      );
      expect(component.showModal).toBeFalse();
    });

    it('should handle error when editing event fails', () => {
      const updatedEvent = { _id: '1', title: 'Updated Event' };
      mockEventsService.editAdminEvent.and.returnValue(
        throwError(() => new Error('Edit failed'))
      );

      component.handleEdit(updatedEvent);

      expect(mockEventsService.editAdminEvent).toHaveBeenCalledWith(
        updatedEvent._id,
        updatedEvent
      );
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Event update Failed'
      );
    });

    it('should not attempt edit if no ID is provided', () => {
      const updatedEvent = { title: 'Updated Event' } as Partial<EventI>;
      spyOn(console, 'error');

      component.handleEdit(updatedEvent);

      expect(console.error).toHaveBeenCalledWith(
        'No event ID provided for editing'
      );
      expect(mockEventsService.editAdminEvent).not.toHaveBeenCalled();
    });
  });

  describe('handleAddEvent', () => {
    it('should add event and refresh events on success', () => {
      const newEvent = mockEvents[0];
      mockEventsService.addAdminEvent.and.returnValue(
        of({ message: 'success', events: [newEvent] })
      );

      component.handleAddEvent(newEvent);

      expect(mockEventsService.addAdminEvent).toHaveBeenCalledWith(newEvent);
      expect(mockEventsService.refreshAdminEvents).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'Event created'
      );
      expect(component.showAddModal).toBeFalse();
    });

    it('should handle error when adding event fails', () => {
      const newEvent = mockEvents[0];
      mockEventsService.addAdminEvent.and.returnValue(
        throwError(() => new Error('Add failed'))
      );

      component.handleAddEvent(newEvent);

      expect(mockEventsService.addAdminEvent).toHaveBeenCalledWith(newEvent);
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'Event creation failed. Please try again.'
      );
    });

    it('should not attempt add if event is empty', () => {
      spyOn(console, 'error');

      component.handleAddEvent(null as any);

      expect(console.error).toHaveBeenCalledWith(
        'Submitted Event cannot be empty'
      );
      expect(mockEventsService.addAdminEvent).not.toHaveBeenCalled();
    });
  });

  describe('modal control methods', () => {
    it('should display add modal', () => {
      component.displayAddModal();
      expect(component.showAddModal).toBeTrue();
    });

    it('should close events modal', () => {
      component.showModal = true;
      component.handleModalClosed();
      expect(component.showModal).toBeFalse();
    });

    it('should close add modal', () => {
      component.showAddModal = true;
      component.handleCloseAddModal();
      expect(component.showAddModal).toBeFalse();
    });

    it('should close confirmation modal', () => {
      component.showConfirmModal = true;
      component.handleCloseConfirmModal();
      expect(component.showConfirmModal).toBeFalse();
    });
  });

  it('should update events when filteredEvents$ emits', () => {
    const newEvents = [mockEvents[0]];
    mockEventsService.filteredEvents$ = of(newEvents);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.events).toEqual(newEvents);
  });
});
