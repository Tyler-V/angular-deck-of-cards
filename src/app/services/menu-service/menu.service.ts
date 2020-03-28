import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player } from 'src/app/rooms/interfaces/player.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private socket: Socket) { }

  currentPlayer = this.socket.fromEvent<Player>('player-entry');
  allPlayers = this.socket.fromEvent<Player[]>('players');
}
