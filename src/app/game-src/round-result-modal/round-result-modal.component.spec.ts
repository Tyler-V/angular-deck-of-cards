import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundResultModalComponent } from './round-result-modal.component';

describe('RoundResultModalComponent', () => {
  let component: RoundResultModalComponent;
  let fixture: ComponentFixture<RoundResultModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundResultModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
