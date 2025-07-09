import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedCardComponent } from './booked-card.component';

describe('BookedCardComponent', () => {
  let component: BookedCardComponent;
  let fixture: ComponentFixture<BookedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
