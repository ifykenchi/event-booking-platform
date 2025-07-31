import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastrService, useValue: toastrService },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showSuccess', () => {
    it('should call toastr.success with default title', () => {
      const message = 'Operation completed successfully';
      service.showSuccess(message);

      expect(toastrService.success).toHaveBeenCalledWith(message, 'Success');
    });

    it('should call toastr.success with custom title', () => {
      const message = 'Operation completed successfully';
      const customTitle = 'Great Success!';
      service.showSuccess(message, customTitle);

      expect(toastrService.success).toHaveBeenCalledWith(message, customTitle);
    });
  });

  describe('showError', () => {
    it('should call toastr.error with default title', () => {
      const message = 'Something went wrong';
      service.showError(message);

      expect(toastrService.error).toHaveBeenCalledWith(message, 'Error');
    });

    it('should call toastr.error with custom title', () => {
      const message = 'Something went wrong';
      const customTitle = 'Critical Error';
      service.showError(message, customTitle);

      expect(toastrService.error).toHaveBeenCalledWith(message, customTitle);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message for success', () => {
      service.showSuccess('');
      expect(toastrService.success).toHaveBeenCalledWith('', 'Success');
    });

    it('should handle empty message for error', () => {
      service.showError('');
      expect(toastrService.error).toHaveBeenCalledWith('', 'Error');
    });
  });
});
