import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private socket: Socket) { }

  currentDocument = this.socket.fromEvent<string>('player');
  documents = this.socket.fromEvent<string[]>('players');

}
