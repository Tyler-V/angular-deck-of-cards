import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SozGottaWaitComponent } from './soz-gotta-wait.component';

describe('SozGottaWaitComponent', () => {
  let component: SozGottaWaitComponent;
  let fixture: ComponentFixture<SozGottaWaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SozGottaWaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SozGottaWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
