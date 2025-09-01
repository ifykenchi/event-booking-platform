import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;

    component.message = 'Test confirmation message';
    component.modalType = 'Confirm';
    component.showConfirmModal = true;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Bindings', () => {
    it('should display the correct message', () => {
      const messageElement = fixture.nativeElement.querySelector('p');
      expect(messageElement.textContent).toContain('Test confirmation message');
    });

    it('should display the correct modal type on button', () => {
      const confirmButton = fixture.nativeElement.querySelector('.btn-primary');
      expect(confirmButton.textContent).toContain('Confirm');
    });

    it('should update message when input changes', () => {
      component.message = 'New test message';
      fixture.detectChanges();
      const messageElement = fixture.nativeElement.querySelector('p');
      expect(messageElement.textContent).toContain('New test message');
    });
  });

  describe('Modal Visibility', () => {
    it('should show modal when showConfirmModal is true', () => {
      component.showConfirmModal = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeTruthy();
      expect(modal.style.display).toBe('block');
    });

    it('should hide modal when showConfirmModal is false', () => {
      component.showConfirmModal = false;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.classList.contains('show')).toBeFalsy();
      expect(modal.style.display).toBe('none');
    });
  });

  describe('Event Emitters', () => {
    it('should emit confirmClick when confirm button is clicked', () => {
      spyOn(component.confirmClick, 'emit');
      const confirmButton = fixture.nativeElement.querySelector('.btn-primary');
      confirmButton.click();
      expect(component.confirmClick.emit).toHaveBeenCalled();
    });

    it('should emit closeModal when close button is clicked', () => {
      spyOn(component.closeModal, 'emit');
      const closeButton = fixture.nativeElement.querySelector('.btn-danger');
      closeButton.click();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should emit closeModal when closeConfirmModal is called', () => {
      spyOn(component.closeModal, 'emit');
      component.closeConfirmModal();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should emit confirmClick when handleConfirm is called', () => {
      spyOn(component.confirmClick, 'emit');
      component.handleConfirm();
      expect(component.confirmClick.emit).toHaveBeenCalled();
    });
  });
});
