import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../../services/dashboard.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', [
      'totalEvents',
      'totalBookings',
      'mostBookedEvents',
      'totalRevenue',
    ]);

    await TestBed.configureTestingModule({
      imports: [NgFor, NgIf, CommonModule, AdminDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.totalEvents).toBe(0);
      expect(component.totalBookings).toBe(0);
      expect(component.totalRevenue).toBe(0);
      expect(component.mostBookedEvents).toEqual([]);
    });

    it('should call loadDashboardData on init', () => {
      spyOn(component, 'loadDashboardData');
      component.ngOnInit();
      expect(component.loadDashboardData).toHaveBeenCalled();
    });
  });

  describe('loadDashboardData', () => {
    it('should load all dashboard data successfully', fakeAsync(() => {
      mockDashboardService.totalEvents.and.returnValue(of({ totalEvents: 10 }));
      mockDashboardService.totalBookings.and.returnValue(
        of({ totalBookings: 50 })
      );
      mockDashboardService.mostBookedEvents.and.returnValue(
        of({
          mostBookedEvents: [
            { title: 'Concert', bookingCount: 20 },
            { title: 'Conference', bookingCount: 15 },
          ],
        })
      );
      mockDashboardService.totalRevenue.and.returnValue(
        of({ totalRevenue: 5000 })
      );

      component.loadDashboardData();
      tick();

      expect(mockDashboardService.totalEvents).toHaveBeenCalled();
      expect(mockDashboardService.totalBookings).toHaveBeenCalled();
      expect(mockDashboardService.mostBookedEvents).toHaveBeenCalled();
      expect(mockDashboardService.totalRevenue).toHaveBeenCalled();

      expect(component.totalEvents).toBe(10);
      expect(component.totalBookings).toBe(50);
      expect(component.mostBookedEvents).toEqual([
        { title: 'Concert', bookingCount: 20 },
        { title: 'Conference', bookingCount: 15 },
      ]);
      expect(component.totalRevenue).toBe(5000);
    }));

    it('should handle errors when loading data fails', fakeAsync(() => {
      const consoleSpy = spyOn(console, 'error');

      mockDashboardService.totalEvents.and.returnValue(
        throwError(() => new Error('Events error'))
      );
      mockDashboardService.totalBookings.and.returnValue(
        throwError(() => new Error('Bookings error'))
      );
      mockDashboardService.mostBookedEvents.and.returnValue(
        throwError(() => new Error('Most booked error'))
      );
      mockDashboardService.totalRevenue.and.returnValue(
        throwError(() => new Error('Revenue error'))
      );

      component.loadDashboardData();
      tick();

      expect(consoleSpy).toHaveBeenCalledWith(
        'failed to fetch total events',
        jasmine.any(Error)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'failed to fetch total bookings',
        jasmine.any(Error)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'failed to fetch most booked events',
        jasmine.any(Error)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'failed to fetch total revenue',
        jasmine.any(Error)
      );

      expect(component.totalEvents).toBe(0);
      expect(component.totalBookings).toBe(0);
      expect(component.mostBookedEvents).toEqual([]);
      expect(component.totalRevenue).toBe(0);
    }));
  });

  describe('UI Rendering', () => {
    beforeEach(fakeAsync(() => {
      mockDashboardService.totalEvents.and.returnValue(of({ totalEvents: 15 }));
      mockDashboardService.totalBookings.and.returnValue(
        of({ totalBookings: 75 })
      );
      mockDashboardService.mostBookedEvents.and.returnValue(
        of({
          mostBookedEvents: [{ title: 'Workshop', bookingCount: 30 }],
        })
      );
      mockDashboardService.totalRevenue.and.returnValue(
        of({ totalRevenue: 7500 })
      );

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should display the dashboard metrics correctly', () => {
      const cards = fixture.nativeElement.querySelectorAll('.card-body h2');
      expect(cards[0].textContent).toContain('15');
      expect(cards[1].textContent).toContain('75');
      expect(cards[2].textContent).toContain('₦7,500.00');

      const mostBookedCards = fixture.nativeElement.querySelectorAll(
        '.col-md-6.col-lg-3 .card-body'
      );
      expect(mostBookedCards[3].textContent).toContain('Workshop');
      expect(mostBookedCards[3].textContent).toContain('30 bookings');
    });

    it('should display "No bookings yet" when no most booked events', fakeAsync(() => {
      mockDashboardService.mostBookedEvents.and.returnValue(of({}));

      component.loadDashboardData();
      tick();
      fixture.detectChanges();

      const mostBookedCards = fixture.nativeElement.querySelectorAll(
        '.col-md-6.col-lg-3 .card-body'
      );
      expect(mostBookedCards[3].textContent).toContain('No bookings yet');
    }));
  });
});
