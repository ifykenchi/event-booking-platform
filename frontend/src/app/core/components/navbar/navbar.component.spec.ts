import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { LocalStorageService } from '../../../services/localStorage.service';
import { EventsService } from '../../../services/events.service';
import { of, throwError } from 'rxjs';
import { Category } from '../../../interfaces/services.interfaces';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockEventsService: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
      'isAdmin',
    ]);
    mockEventsService = jasmine.createSpyObj('EventsService', [
      'searchAdminEvents',
      'searchUserEvents',
      'setFilteredEvents',
    ]);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should set isAdmin to true when localStorage service returns true', () => {
      mockLocalStorageService.isAdmin.and.returnValue(true);
      fixture.detectChanges();
      expect(component.isAdmin).toBeTrue();
    });

    it('should set isAdmin to false when localStorage service returns false', () => {
      mockLocalStorageService.isAdmin.and.returnValue(false);
      fixture.detectChanges();
      expect(component.isAdmin).toBeFalse();
    });
  });

  describe('UI Rendering', () => {
    it('should show "Manage Events" when user is admin', () => {
      mockLocalStorageService.isAdmin.and.returnValue(true);
      fixture.detectChanges();
      const brandElement = fixture.nativeElement.querySelector('.navbar-brand');
      expect(brandElement.textContent).toContain('Manage Events');
    });

    it('should show "Events" when user is not admin', () => {
      mockLocalStorageService.isAdmin.and.returnValue(false);
      fixture.detectChanges();
      const brandElement = fixture.nativeElement.querySelector('.navbar-brand');
      expect(brandElement.textContent).toContain('Events');
    });
  });

  describe('Category Filtering', () => {
    const mockEvents = [{ id: 1, title: 'Test Event' }] as any;

    beforeEach(() => {
      mockEventsService.searchAdminEvents.and.returnValue(of(mockEvents));
      mockEventsService.searchUserEvents.and.returnValue(of(mockEvents));
    });

    it('should call admin event search when isAdmin is true', () => {
      component.isAdmin = true;
      component.filterClick('Tech');

      expect(mockEventsService.searchAdminEvents).toHaveBeenCalledWith(
        'category',
        'Tech'
      );
      expect(mockEventsService.searchUserEvents).not.toHaveBeenCalled();
      expect(mockEventsService.setFilteredEvents).toHaveBeenCalledWith(
        mockEvents
      );
    });

    it('should call user event search when isAdmin is false', () => {
      component.isAdmin = false;
      component.filterClick('Football');

      expect(mockEventsService.searchUserEvents).toHaveBeenCalledWith(
        'category',
        'Football'
      );
      expect(mockEventsService.searchAdminEvents).not.toHaveBeenCalled();
      expect(mockEventsService.setFilteredEvents).toHaveBeenCalledWith(
        mockEvents
      );
    });

    it('should handle ALL category filter', () => {
      component.isAdmin = true;
      component.filterClick('ALL');

      expect(mockEventsService.searchAdminEvents).toHaveBeenCalledWith(
        'category',
        'ALL'
      );
    });

    it('should handle error cases for Admin', () => {
      const consoleSpy = spyOn(console, 'error');
      mockEventsService.searchAdminEvents.and.returnValue(
        throwError(() => new Error('Test Error'))
      );
      mockEventsService.searchUserEvents.and.returnValue(of(mockEvents));

      component.isAdmin = true;
      component.filterClick('Entertainment');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed Request',
        jasmine.any(Error)
      );
    });

    it('should handle error cases for User', () => {
      const consoleSpy = spyOn(console, 'error');
      mockEventsService.searchAdminEvents.and.returnValue(of(mockEvents));
      mockEventsService.searchUserEvents.and.returnValue(
        throwError(() => new Error('Test Error'))
      );

      component.isAdmin = false;
      component.filterClick('Entertainment');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed Request',
        jasmine.any(Error)
      );
    });
  });

  describe('Dropdown Menu', () => {
    it('should render all category options', () => {
      fixture.detectChanges();
      const dropdownItems =
        fixture.nativeElement.querySelectorAll('.dropdown-item');

      expect(dropdownItems.length).toBe(5);
      expect(dropdownItems[0].textContent).toContain('All Events');
      expect(dropdownItems[1].textContent).toContain('Entertainment');
      expect(dropdownItems[2].textContent).toContain('Football');
      expect(dropdownItems[3].textContent).toContain('Tech');
      expect(dropdownItems[4].textContent).toContain('Others');
    });

    it('should call filterClick when category is selected', () => {
      spyOn(component, 'filterClick');
      fixture.detectChanges();

      const dropdownItems =
        fixture.nativeElement.querySelectorAll('.dropdown-item');
      dropdownItems[1].click();

      expect(component.filterClick).toHaveBeenCalledWith('Entertainment');
    });
  });
});
