import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';
import { dashboardResponseI } from '../interfaces/services.interfaces';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const mockDashboardResponse: dashboardResponseI = {
    message: 'Success',
  };

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardService,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;

    localStorageService.getItem.and.returnValue('valid-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('HTTP Methods', () => {
    it('should get total events', () => {
      service.totalEvents().subscribe((res) => {
        expect(res).toEqual(mockDashboardResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/dashboard/events`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockDashboardResponse);
    });

    it('should get total bookings', () => {
      service.totalBookings().subscribe((res) => {
        expect(res).toEqual(mockDashboardResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/dashboard/bookings`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockDashboardResponse);
    });

    it('should get most booked events', () => {
      service.mostBookedEvents().subscribe((res) => {
        expect(res).toEqual(mockDashboardResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/dashboard/most-booked-events`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockDashboardResponse);
    });

    it('should get total revenue', () => {
      service.totalRevenue().subscribe((res) => {
        expect(res).toEqual(mockDashboardResponse);
      });

      const req = httpMock.expectOne(
        `${environment.domain}/admin/dashboard/total-revenue`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockDashboardResponse);
    });
  });

  describe('Token Handling', () => {
    it('should throw error when no admin token for totalEvents', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.totalEvents().subscribe();
      }).toThrowError('No access token found');
    });

    it('should throw error when no admin token for totalBookings', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.totalBookings().subscribe();
      }).toThrowError('No access token found');
    });

    it('should throw error when no admin token for mostBookedEvents', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.mostBookedEvents().subscribe();
      }).toThrowError('No access token found');
    });

    it('should throw error when no admin token for totalRevenue', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.totalRevenue().subscribe();
      }).toThrowError('No access token found');
    });
  });

  describe('Request Validation', () => {
    it('should include authorization header', () => {
      service.totalEvents().subscribe();

      const req = httpMock.expectOne(
        `${environment.domain}/admin/dashboard/events`
      );
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer valid-token'
      );
    });
  });
});
