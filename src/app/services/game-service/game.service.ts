import { Bet, Round1APIResponse, RoundAPIResponse } from '../../interfaces/round.interface';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Player } from 'src/app/interfaces/player.interface';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {
  userId: number;
  constructor(
    private socket: Socket,
    private readonly router: Router
  ) { }
  ngOnInit(): void {
    this.userId = JSON.parse(sessionStorage.getItem('userId'));
  }
  getUserId(): number {
    return this.userId;
  }
  getCurrentRound(): Observable<number> {
    this.socket.emit('get current round');
    return this.socket.fromEvent<number>('current round is');
  }
  initRound(round: number): Observable<RoundAPIResponse> {
    const id = JSON.parse(sessionStorage.getItem('user')).uniqueId;
    this.socket.emit('get round data', {round, id});
    return this.socket.fromEvent<RoundAPIResponse>('round data');
  }
  initNextRound(): Observable<any> {
    this.socket.emit('set up next round');
    return this.socket.fromEvent<any>('start next round');
  }
  makeBet(bet: Bet, isDealerBet: boolean): void {
    this.socket.emit('making a bet', {...bet, uniqueId: this.userId, isDealerBet});
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
  listenForRound1Results(): Observable<Round1APIResponse> {
    return this.socket.fromEvent<Round1APIResponse>('play out edge round');
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

  samePlayers(): Observable<Player[]> {
    this.socket.emit('new game same players');
    return this.socket.fromEvent<Player[]>('round players').pipe(take(1));
  }
  quit(): void {
    this.socket.emit('quit');
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
