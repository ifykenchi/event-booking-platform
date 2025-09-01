import TokenUtil from './token.util';

describe('TokenUtil', () => {
  let tokenUtil: typeof TokenUtil;

  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    tokenUtil = TokenUtil;

    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key] || null;
    });
  });

  afterEach(() => {
    mockLocalStorage = {};
  });

  describe('user_token()', () => {
    it('should return true when accessToken exists', () => {
      mockLocalStorage['accessToken'] = 'test-token-123';
      expect(tokenUtil.user_token()).toBeTrue();
    });

    it('should return false when accessToken does not exist', () => {
      expect(tokenUtil.user_token()).toBeFalse();
    });
  });

  describe('admin_token()', () => {
    it('should return true when adminToken exists', () => {
      mockLocalStorage['adminToken'] = 'admin-token-456';
      expect(tokenUtil.admin_token()).toBeTrue();
    });

    it('should return false when adminToken does not exist', () => {
      expect(tokenUtil.admin_token()).toBeFalse();
    });
  });
});
