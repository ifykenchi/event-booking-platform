import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManEventsComponent } from './man-events.component';

describe('ManEventsComponent', () => {
  let component: ManEventsComponent;
  let fixture: ComponentFixture<ManEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
