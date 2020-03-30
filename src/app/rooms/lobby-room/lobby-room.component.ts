import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.scss']
})
export class LobbyRoomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  getHostButtonText(): string {
    return 'startGame';
  }
}
