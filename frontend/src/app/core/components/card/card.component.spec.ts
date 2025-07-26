import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { EventI } from '../../../interfaces/services.interfaces';
import { LocalStorageService } from '../../../services/localStorage.service';
import { NgIf, CommonModule } from '@angular/common';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  const mockEventData: EventI = {
    _id: 'event-123',
    title: 'Test Event',
    category: 'Tech',
    about: 'This is a test event description',
    price: 1000,
    totalSeats: 100,
    availableSeats: 75,
    createdOn: '12th nov, 2025',
  };

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'isAdmin',
    ]);

    await TestBed.configureTestingModule({
      imports: [CardComponent, NgIf, CommonModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;

    component.eventData = mockEventData;
    component.availableSeats = mockEventData.availableSeats as any;

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

  describe('Event Data Display', () => {
    it('should display correct event title', () => {
      const title = fixture.nativeElement.querySelector('.card-title');
      expect(title.textContent).toContain('Test Event');
    });

    it('should display correct category', () => {
      const category = fixture.nativeElement.querySelector(
        '.badge.text-bg-warning'
      );
      expect(category.textContent).toContain('Tech');
    });

    it('should display correct about text', () => {
      const about = fixture.nativeElement.querySelector('.card-text');
      expect(about.textContent).toContain('This is a test event description');
    });

    it('should display "Free" for free events', () => {
      component.eventData.price = 0;
      fixture.detectChanges();
      const price = fixture.nativeElement.querySelectorAll(
        '.badge.text-bg-info'
      )[0];
      expect(price.textContent).toContain('Free');
    });

    it('should display correct seat availability', () => {
      const seats = fixture.nativeElement.querySelectorAll(
        '.badge.text-bg-info'
      )[1];
      expect(seats.textContent).toContain('available seats: 75/100');
    });
  });

  describe('Button Visibility', () => {
    it('should show Book button for non-admin users', () => {
      component.isAdmin = false;
      fixture.detectChanges();

      const bookButton = fixture.nativeElement.querySelector('.btn-success');
      const editButton = fixture.nativeElement.querySelector('.btn-primary');
      const deleteButton = fixture.nativeElement.querySelector('.btn-danger');

      expect(bookButton).toBeTruthy();
      expect(editButton).toBeNull();
      expect(deleteButton).toBeNull();
    });

    it('should show Edit and Delete buttons for admin users', () => {
      component.isAdmin = true;
      fixture.detectChanges();

      const bookButton = fixture.nativeElement.querySelector('.btn-success');
      const editButton = fixture.nativeElement.querySelector('.btn-primary');
      const deleteButton = fixture.nativeElement.querySelector('.btn-danger');

      expect(bookButton).toBeNull();
      expect(editButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Event Emitters', () => {
    it('should emit event id when onDelete is called', () => {
      spyOn(component.deleteClick, 'emit');
      component.onDelete();
      expect(component.deleteClick.emit).toHaveBeenCalledWith('event-123');
    });

    it('should emit event data when onEdit is called', () => {
      spyOn(component.editClick, 'emit');
      component.onEdit();
      expect(component.editClick.emit).toHaveBeenCalledWith(mockEventData);
      expect(component.show).toBeTrue();
    });

    it('should emit event id when onBook is called', () => {
      spyOn(component.bookClick, 'emit');
      component.onBook();
      expect(component.bookClick.emit).toHaveBeenCalledWith('event-123');
    });
  });
});
