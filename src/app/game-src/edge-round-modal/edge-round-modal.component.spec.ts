import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EdgeRoundModalComponent } from './edge-round-modal.component';

describe('EdgeRoundModalComponent', () => {
  let component: EdgeRoundModalComponent;
  let fixture: ComponentFixture<EdgeRoundModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeRoundModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeRoundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
