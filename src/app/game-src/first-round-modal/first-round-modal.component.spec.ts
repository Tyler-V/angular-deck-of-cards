import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstRoundModalComponent } from './first-round-modal.component';

describe('FirstRoundModalComponent', () => {
  let component: FirstRoundModalComponent;
  let fixture: ComponentFixture<FirstRoundModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstRoundModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstRoundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
