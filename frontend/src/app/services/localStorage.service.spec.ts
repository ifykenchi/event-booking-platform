import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './localStorage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    mockLocalStorage = {};
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        mockLocalStorage[key] = value;
      }
    );
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      mockLocalStorage = {};
    });
  });

  afterEach(() => {
    mockLocalStorage = {};
  });

  describe('Basic Operations', () => {
    it('should set and get an item', () => {
      service.setItem('testKey', 'testValue');
      expect(service.getItem('testKey')).toBe('testValue');
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
      expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    it('should return null for non-existent item', () => {
      expect(service.getItem('nonExistent')).toBeNull();
    });

    it('should remove an item', () => {
      service.setItem('toRemove', 'value');
      service.removeItem('toRemove');
      expect(service.getItem('toRemove')).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('toRemove');
    });
  });

  describe('Authentication Methods', () => {
    it('should return true for isLoggedIn when accessToken exists', () => {
      service.setItem('accessToken', 'user-token');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return true for isLoggedIn when adminToken exists', () => {
      service.setItem('adminToken', 'admin-token');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false for isLoggedIn when no tokens exist', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return true for isAdmin when adminToken exists', () => {
      service.setItem('adminToken', 'admin-token');
      expect(service.isAdmin()).toBeTrue();
    });

    it('should return false for isAdmin when no adminToken exists', () => {
      expect(service.isAdmin()).toBeFalse();
    });

    it('should clear only auth tokens', () => {
      service.setItem('accessToken', 'user-token');
      service.setItem('adminToken', 'admin-token');
      service.setItem('otherKey', 'should-remain');
      service.clear();

      expect(service.getItem('accessToken')).toBeNull();
      expect(service.getItem('adminToken')).toBeNull();
      expect(service.getItem('otherKey')).toBe('should-remain');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined values', () => {
      service.setItem('nullKey', null as any);
      expect(service.getItem('nullKey')).toBeNull();
    });

    it('should not throw when removing non-existent item', () => {
      expect(() => service.removeItem('nonExistent')).not.toThrow();
    });
  });
});
