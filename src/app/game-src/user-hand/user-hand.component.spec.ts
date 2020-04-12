import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHandComponent } from './user-hand.component';

describe('UserHandComponent', () => {
  let component: UserHandComponent;
  let fixture: ComponentFixture<UserHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
