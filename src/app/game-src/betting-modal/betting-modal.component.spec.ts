import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingModalComponent } from './betting-modal.component';

describe('BettingModalComponent', () => {
  let component: BettingModalComponent;
  let fixture: ComponentFixture<BettingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BettingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
