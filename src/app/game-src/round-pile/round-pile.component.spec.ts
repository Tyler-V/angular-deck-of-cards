import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPileComponent } from './round-pile.component';

describe('RoundPileComponent', () => {
  let component: RoundPileComponent;
  let fixture: ComponentFixture<RoundPileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundPileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
