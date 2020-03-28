import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyRoomComponent } from './lobby-room.component';

describe('LobbyRoomComponent', () => {
  let component: LobbyRoomComponent;
  let fixture: ComponentFixture<LobbyRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
