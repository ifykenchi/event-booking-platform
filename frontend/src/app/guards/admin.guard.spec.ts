import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import TokenUtil from '../../utils/token.util';

describe('AdminGuard', () => {
  let tokenUtil: typeof TokenUtil;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    tokenUtil = TokenUtil;
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('should allow access when admin_token exists', () => {
    spyOn(tokenUtil, 'admin_token').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /admin/register when admin_token does not exist', () => {
    spyOn(TokenUtil as any, 'admin_token').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/admin/register']);
  });

  it('should inject Router dependency properly', () => {
    spyOn(TokenUtil as any, 'admin_token').and.returnValue(false);
    const injector = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    expect(injector).toBeTruthy();
  });
});
