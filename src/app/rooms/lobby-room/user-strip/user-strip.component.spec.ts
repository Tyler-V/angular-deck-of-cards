import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStripComponent } from './user-strip.component';

describe('UserStripComponent', () => {
  let component: UserStripComponent;
  let fixture: ComponentFixture<UserStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
