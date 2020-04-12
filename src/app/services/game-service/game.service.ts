import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Round } from '../../interfaces/round.interface';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private socket: Socket) { }

  getCurrentRound(): Observable<number> {
    this.socket.emit('get current round');
    return this.socket.fromEvent<number>('current round is');
  }
  initRound(round: number): Observable<Round> {
    const id = JSON.parse(sessionStorage.getItem('user')).uniqueId;
    this.socket.emit('get round data', {round, id});
    return this.socket.fromEvent<Round>('round data');
  }


}
