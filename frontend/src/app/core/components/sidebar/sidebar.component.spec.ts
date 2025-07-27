import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { LocalStorageService } from '../../../services/localStorage.service';
import { RegisterService } from '../../../services/register.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let router: Router;

  const mockAdminResponse = {
    message: 'Success',
    adminData: {
      userId: 'adminUserId-string',
      username: 'adminUser',
      password: 'adminUser password',
    },
  };

  const mockUserResponse = {
    message: 'Success',
    userData: {
      userId: 'userId-string',
      username: 'userName',
      password: 'user password',
    },
  };

  beforeEach(async () => {
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
      'isAdmin',
      'clear',
    ]);

    mockRegisterService = jasmine.createSpyObj('RegisterService', [
      'getAdmin',
      'getUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: RegisterService, useValue: mockRegisterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
      mockRegisterService.getAdmin.and.returnValue(of(mockAdminResponse));

      fixture.detectChanges();

      expect(component.isAdmin).toBeTrue();
      expect(mockRegisterService.getAdmin).toHaveBeenCalled();
      expect(component.username).toBe('adminUser');
    });

    it('should set isAdmin to false when localStorage service returns false', () => {
      mockLocalStorageService.isAdmin.and.returnValue(false);
      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));

      fixture.detectChanges();

      expect(component.isAdmin).toBeFalse();
      expect(mockRegisterService.getUser).toHaveBeenCalled();
      expect(component.username).toBe('userName');
    });

    it('should handle error when admin data fetch fails', () => {
      const consoleSpy = spyOn(console, 'error');
      mockLocalStorageService.isAdmin.and.returnValue(true);
      mockRegisterService.getAdmin.and.returnValue(
        throwError(() => new Error('Test Error'))
      );

      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unauthorized User',
        jasmine.any(Error)
      );
    });

    it('should handle error when user data fetch fails', () => {
      const consoleSpy = spyOn(console, 'error');
      mockLocalStorageService.isAdmin.and.returnValue(false);
      mockRegisterService.getUser.and.returnValue(
        throwError(() => new Error('Test Error'))
      );

      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unauthorized User',
        jasmine.any(Error)
      );
    });
  });

  describe('UI Rendering', () => {
    it('should show admin links when user is admin', () => {
      mockLocalStorageService.isAdmin.and.returnValue(true);
      mockRegisterService.getAdmin.and.returnValue(of(mockAdminResponse));
      fixture.detectChanges();

      const adminLinks = fixture.nativeElement.querySelectorAll('li.nav-item');
      expect(adminLinks.length).toBe(3); // Dashboard, Events, Bookings
      expect(adminLinks[0].textContent).toContain('Dashboard');
      expect(adminLinks[1].textContent).toContain('Events');
      expect(adminLinks[2].textContent).toContain('Bookings');
    });

    it('should show user links when user is not admin', () => {
      mockLocalStorageService.isAdmin.and.returnValue(false);
      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      fixture.detectChanges();

      const userLinks = fixture.nativeElement.querySelectorAll('li.nav-item');
      expect(userLinks.length).toBe(3);
      expect(userLinks[0].textContent).toContain('Dashboard');
      expect(userLinks[1].textContent).toContain('Events');
      expect(userLinks[2].textContent).toContain('Bookings');
    });

    it('should display the username', () => {
      mockLocalStorageService.isAdmin.and.returnValue(false);
      mockRegisterService.getUser.and.returnValue(of(mockUserResponse));
      fixture.detectChanges();

      const welcomeText = fixture.nativeElement.querySelector('.fs-4');
      expect(welcomeText.textContent).toContain('Welcome userName');
    });
  });

  describe('isActive', () => {
    it('should call router.isActive with correct parameters', () => {
      const testRoute = '/test-route';

      const isActiveSpy = spyOn(router, 'isActive').and.returnValue(true);

      const result = component.isActive(testRoute);

      expect(isActiveSpy).toHaveBeenCalledWith(testRoute, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
      expect(result).toBeTrue();
    });
  });

  describe('logout', () => {
    it('should clear storage and navigate to admin login when admin', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.isAdmin = true;
      component.logout();

      expect(mockLocalStorageService.clear).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/login']);
    });

    it('should clear storage and navigate to user login when not admin', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.isAdmin = false;
      component.logout();

      expect(mockLocalStorageService.clear).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/user/login']);
    });
  });
});
