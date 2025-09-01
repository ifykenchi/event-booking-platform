import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { userGuard } from './user.guard';
import TokenUtil from '../../utils/token.util';

describe('UserGuard', () => {
  let tokenUtil: typeof TokenUtil;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    tokenUtil = TokenUtil;
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('should allow access when user_token exists', () => {
    spyOn(tokenUtil, 'user_token').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      userGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /user/register when user_token does not exist', () => {
    spyOn(TokenUtil as any, 'user_token').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      userGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/user/register']);
  });

  it('should inject Router dependency properly', () => {
    spyOn(TokenUtil as any, 'user_token').and.returnValue(false);
    const injector = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      userGuard({} as any, {} as any)
    );

    expect(injector).toBeTruthy();
  });
});
