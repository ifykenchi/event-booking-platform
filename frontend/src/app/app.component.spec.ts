import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { LocalStorageService } from './services/localStorage.service';

describe('AppComponent', () => {
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', [
      'isLoggedIn',
    ]);
    router = jasmine.createSpyObj('Router', [], { url: '/default-route' });

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: Router, useValue: router },
      ],
    });
  });

  describe('showComponent', () => {
    it('should return FALSE for auth routes when logged in', () => {
      localStorageService.isLoggedIn.and.returnValue(true);
      (
        Object.getOwnPropertyDescriptor(router, 'url')?.get as jasmine.Spy
      ).and.returnValue('/user/login');

      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;

      expect(component.showComponent).toBeFalse();
    });

    it('should return TRUE for non-auth routes when logged in', () => {
      localStorageService.isLoggedIn.and.returnValue(true);
      (
        Object.getOwnPropertyDescriptor(router, 'url')?.get as jasmine.Spy
      ).and.returnValue('/home');

      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;

      expect(component.showComponent).toBeTrue();
    });

    it('should return FALSE when not logged in', () => {
      localStorageService.isLoggedIn.and.returnValue(false);
      (
        Object.getOwnPropertyDescriptor(router, 'url')?.get as jasmine.Spy
      ).and.returnValue('/home');

      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;

      expect(component.showComponent).toBeFalse();
    });
  });
});
