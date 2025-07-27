import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookedCardComponent } from './booked-card.component';
import { LocalStorageService } from '../../../services/localStorage.service';
import { NgIf, NgClass, CommonModule } from '@angular/common';

describe('BookedCardComponent', () => {
  let component: BookedCardComponent;
  let fixture: ComponentFixture<BookedCardComponent>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const mockBookingData: any = {
    _id: 'booking-123',
    eventId: {
      _id: 'event-123',
      title: 'Test Event',
      category: 'Tech',
      price: 1000,
    },
    priceAtBooking: 1000,
    status: true,
  };

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'isAdmin',
    ]);

    await TestBed.configureTestingModule({
      imports: [BookedCardComponent, NgIf, NgClass, CommonModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookedCardComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;

    component.bookingData = mockBookingData;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Admin Check', () => {
    it('should set isAdmin to false when user is not admin', () => {
      localStorageService.isAdmin.and.returnValue(false);
      component.ngOnInit();
      expect(component.isAdmin).toBeFalse();
    });

    it('should set isAdmin to true when user is admin', () => {
      localStorageService.isAdmin.and.returnValue(true);
      component.ngOnInit();
      expect(component.isAdmin).toBeTrue();
    });
  });

  describe('Event Emitters', () => {
    it('should emit booking id when onCancelBooking is called', () => {
      spyOn(component.cancelBooking, 'emit');
      component.onCancelBooking();
      expect(component.cancelBooking.emit).toHaveBeenCalledWith('booking-123');
    });

    it('should emit booking data when onOpenDetailsModal is called', () => {
      spyOn(component.openDetailsModal, 'emit');
      component.onOpenDetailsModal();
      expect(component.openDetailsModal.emit).toHaveBeenCalledWith(
        mockBookingData
      );
    });
  });

  describe('DOM Rendering', () => {
    it('should not render card for admin users', () => {
      component.isAdmin = true;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.card');
      expect(card).toBeNull();
    });

    it('should render card for non-admin users', () => {
      component.isAdmin = false;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.card');
      expect(card).toBeTruthy();
    });

    it('should display correct event title', () => {
      component.isAdmin = false;
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('.card-title');
      expect(title.textContent).toContain('Test Event');
    });

    it('should display correct category', () => {
      component.isAdmin = false;
      fixture.detectChanges();
      const category = fixture.nativeElement.querySelector(
        '.badge.text-bg-warning'
      );
      expect(category.textContent).toContain('category: Tech');
    });

    describe('Price Display', () => {
      it('should show "Free" when priceAtBooking is 0', () => {
        component.bookingData.priceAtBooking = 0;
        fixture.detectChanges();

        const priceBadge = fixture.nativeElement.querySelector(
          '.badge.text-bg-success'
        );
        expect(priceBadge.textContent).toContain('Price at booking: Free');
      });

      it('should show formatted price when priceAtBooking > 0', () => {
        component.bookingData.priceAtBooking = 1500;
        fixture.detectChanges();

        const priceBadge = fixture.nativeElement.querySelector(
          '.badge.text-bg-info'
        );
        expect(priceBadge.textContent).toContain('Price at booking: ₦1,500.00');
      });
    });
  });
});
