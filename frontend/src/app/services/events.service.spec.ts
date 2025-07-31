import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';
import {
  EventI,
  responseI,
  SearchKey,
  DeleteI,
} from '../interfaces/services.interfaces';
import { BehaviorSubject, of } from 'rxjs';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const mockEvent: EventI = {
    _id: 'event1',
    title: 'Test Event',
    about: 'Event Description',
    totalSeats: 100,
    category: 'Tech',
    price: 1000,
    createdOn: '2023-01-01',
  };

  const mockResponse: responseI = {
    message: 'success',
    events: [mockEvent],
  };

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
      'setItem',
      'removeItem',
      'isLoggedIn',
      'isAdmin',
      'clear',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventsService,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    });

    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Admin Methods', () => {
    beforeEach(() => {
      localStorageService.getItem.and.returnValue('admin-token');
    });

    it('should get admin events', () => {
      service.getAdminEvents().subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/admin/events`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockResponse);
    });

    it('should get single admin event', () => {
      const eventId = 'event1';
      service.getAdminEvent(eventId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/events/${eventId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should add admin event', () => {
      service.addAdminEvent(mockEvent).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/admin/event`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEvent);
      req.flush(mockResponse);
    });

    it('should edit admin event', () => {
      const eventId = 'event1';
      const updates = { title: 'Updated Event' };

      service.editAdminEvent(eventId, updates).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/event/${eventId}`
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updates);
      req.flush(mockResponse);
    });

    it('should search admin events', () => {
      const searchParams = { key: 'title' as SearchKey, value: 'Test' };

      service
        .searchAdminEvents(searchParams.key, searchParams.value)
        .subscribe((res) => {
          expect(res).toEqual([mockEvent]);
        });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/search?key=${searchParams.key}&value=${searchParams.value}`
      );
      expect(req.request.method).toBe('GET');
      req.flush([mockEvent]);
    });

    it('should delete admin event', () => {
      const eventId = 'event1';
      const mockDeleteResponse: DeleteI = { message: 'Deleted' };

      service.deleteAdminEvent(eventId).subscribe((res) => {
        expect(res).toEqual(mockDeleteResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/delete/${eventId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(mockDeleteResponse);
    });
  });

  describe('User Methods', () => {
    beforeEach(() => {
      localStorageService.getItem.and.returnValue('user-token');
    });

    it('should get user events', () => {
      service.getUserEvents().subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/user/events`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockResponse);
    });

    it('should search user events', () => {
      const searchParams = { key: 'category' as SearchKey, value: 'Tech' };

      service
        .searchUserEvents(searchParams.key, searchParams.value)
        .subscribe((res) => {
          expect(res).toEqual([mockEvent]);
        });

      const req = httpMock.expectOne(
        `${environment.domain}/user/search?key=${searchParams.key}&value=${searchParams.value}`
      );
      expect(req.request.method).toBe('GET');
      req.flush([mockEvent]);
    });
  });

  describe('Token Handling', () => {
    it('should throw error when no user token', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.getUserEvents().subscribe();
      }).toThrowError('Token not found');
    });

    it('should throw error when no admin token', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.getAdminEvents().subscribe();
      }).toThrowError('No access token found');
    });
  });

  describe('BehaviorSubject Management', () => {
    it('should update filtered events', () => {
      const testEvents = [mockEvent];
      service.setFilteredEvents(testEvents);

      service.filteredEvents$.subscribe((events) => {
        expect(events).toEqual(testEvents);
      });
    });

    it('should refresh admin events', () => {
      spyOn(service, 'getAdminEvents').and.returnValue(of(mockResponse));

      service.refreshAdminEvents();

      service.filteredEvents$.subscribe((events) => {
        expect(events).toEqual(mockResponse.events);
      });
    });

    it('should refresh user events', () => {
      spyOn(service, 'getUserEvents').and.returnValue(of(mockResponse));

      service.refreshUserEvents();

      service.filteredEvents$.subscribe((events) => {
        expect(events).toEqual(mockResponse.events);
      });
    });
  });
});
