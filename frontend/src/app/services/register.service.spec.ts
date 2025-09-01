import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RegisterService } from './register.service';
import { LocalStorageService } from './localStorage.service';
import { environment } from '../../environments/environment';
import { of, throwError } from 'rxjs';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const mockUserResponse = {
    message: 'success',
    userData: { userId: '1', username: 'user', password: '123456' },
  };

  const mockAdminResponse = {
    message: 'success',
    adminData: { userId: '1', username: 'admin', password: '123456' },
  };

  const mockAuthResponse = {
    message: 'success',
    accessToken: 'user-token-123',
    adminToken: 'admin-token-456',
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
        RegisterService,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    });

    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Token Handling', () => {
    it('should throw error when no user token', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.getUser().subscribe();
      }).toThrowError('Token not found');
    });

    it('should throw error when no admin token', () => {
      localStorageService.getItem.and.returnValue(null);

      expect(() => {
        service.getAdmin().subscribe();
      }).toThrowError('No access token found');
    });
  });

  describe('Admin Operations', () => {
    it('should get admin data', () => {
      localStorageService.getItem.and.returnValue('valid-token');

      service.getAdmin().subscribe((res) => {
        expect(res).toEqual(mockAdminResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/admin`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockAdminResponse);
    });

    it('should register admin', () => {
      const newAdmin = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password',
      };

      service.adminSignup(newAdmin).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorageService.setItem).toHaveBeenCalledWith(
          'adminToken',
          'admin-token-456'
        );
      });

      const req = httpMock.expectOne(`${environment.domain}/admin/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockAuthResponse, adminToken: 'admin-token-456' });
    });

    it('should login admin', () => {
      const credentials = { email: 'admin@example.com', password: 'password' };

      service.adminLogin(credentials).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorageService.setItem).toHaveBeenCalledWith(
          'adminToken',
          'admin-token-456'
        );
      });

      const req = httpMock.expectOne(`${environment.domain}/admin/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockAuthResponse, adminToken: 'admin-token-456' });
    });
  });

  describe('User Operations', () => {
    it('should get user data', () => {
      localStorageService.getItem.and.returnValue('valid-token');

      service.getUser().subscribe((res) => {
        expect(res).toEqual(mockUserResponse);
      });

      const req = httpMock.expectOne(`${environment.domain}/user`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockUserResponse);
    });

    it('should register user', () => {
      const newUser = {
        username: 'user',
        email: 'user@example.com',
        password: 'password',
      };

      service.userSignup(newUser).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorageService.setItem).toHaveBeenCalledWith(
          'accessToken',
          'user-token-123'
        );
      });

      const req = httpMock.expectOne(`${environment.domain}/user/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockAuthResponse, accessToken: 'user-token-123' });
    });

    it('should login user', () => {
      const credentials = { email: 'user@example.com', password: 'password' };

      service.userLogin(credentials).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorageService.setItem).toHaveBeenCalledWith(
          'accessToken',
          'user-token-123'
        );
      });

      const req = httpMock.expectOne(`${environment.domain}/user/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockAuthResponse, accessToken: 'user-token-123' });
    });
  });

  describe('Error Handling', () => {
    it('should handle registration error', () => {
      const newUser = {
        username: 'user',
        email: 'user@example.com',
        password: 'password',
      };

      service.userSignup(newUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${environment.domain}/user/register`);
      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });

    it('should not store token if not in response', () => {
      const credentials = { email: 'user@example.com', password: 'password' };

      service.userLogin(credentials).subscribe((res) => {
        expect(res).toEqual({ message: 'success' });
        expect(localStorageService.setItem).not.toHaveBeenCalled();
      });

      const req = httpMock.expectOne(`${environment.domain}/user/login`);
      req.flush({ message: 'success' });
    });
  });
});
