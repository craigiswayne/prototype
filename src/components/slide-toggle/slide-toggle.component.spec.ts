import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideToggleComponent } from './slide-toggle.component';

describe('ToggleComponent', () => {
  let component: SlideToggleComponent;
  let fixture: ComponentFixture<SlideToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
