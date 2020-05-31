import * as io from 'socket.io-client';

import { Component } from '@angular/core';

@Component({
  selector: 'doc-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  socket: io.SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect();
    console.log(this.socket);
  }
}
