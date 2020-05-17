import { Bet, Round } from '../../interfaces/round.interface';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {
  userId: number;
  constructor(private socket: Socket) { }
  ngOnInit(): void {
    this.userId = JSON.parse(sessionStorage.getItem('userId'));
  }
  getCurrentRound(): Observable<number> {
    this.socket.emit('get current round');
    return this.socket.fromEvent<number>('current round is');
  }
  initRound(round: number): Observable<Round> {
    const id = JSON.parse(sessionStorage.getItem('user')).uniqueId;
    this.socket.emit('get round data', {round, id});
    return this.socket.fromEvent<Round>('round data');
  }
  initNextRound(): Observable<any> {
    this.socket.emit('set up next round');
    return this.socket.fromEvent<any>('start next round');
  }
  makeBet(bet: Bet, id: any): void {
    this.socket.emit('making a bet', {...bet, uniqueId: id});
  }
  changeDealerBet(bet: number): void {
    this.socket.emit('dealer changed bet', bet);
  }
  listenForPlayerMakingBet(): Observable<Bet> {
    return this.socket.fromEvent<Bet>('diff player made a bet');
  }
  listenForDealerRebet(): Observable<number[]> {
    return this.socket.fromEvent<number[]>('dealer change bet');
  }
  listenForReveal(): Observable<any> {
    return this.socket.fromEvent<any>('reveal bets');
  }
  listenForRound1Results(): Observable<any> {
    return this.socket.fromEvent<any>('play out first round');
  }
  listenForNextRound(): Observable<any> {
    return this.socket.fromEvent<any>('start next round');
  }
  listenForOthersPlayingCard(): Observable<any> {
    return this.socket.fromEvent<any>('somebody played card');
  }
  listenForHitWinner(): Observable<any> {
    return this.socket.fromEvent<any>('hit winner is');
  }
  listenForRoundEnd(): Observable<any> {
    return this.socket.fromEvent<any>('round finished').pipe(take(1));
  }
  playCard(card) {
    const id = JSON.parse(sessionStorage.getItem('user')).uniqueId;
    this.socket.emit('card played', {...card, uniqueId: id});
  }
}
