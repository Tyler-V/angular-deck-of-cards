import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Player, UpdatedPlayer } from '../../interfaces/player.interface';
import { take, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private socket: Socket,
    private readonly router: Router
  ) { }

  land(): Observable<any> {
    const id = this.createUniqueId();
    // create uniqueID and store it in session storage if there is none so far
    sessionStorage.setItem('userId', `${id}`);

    this.socket.emit('landing', id);
    // Set landing data on number of players in the lobby
    return this.socket.fromEvent<number>('playerCount');
  }

  // Set current user and handle reloads
  login(user: Player): void {
    console.log('Logging in...');

    const userId = JSON.parse(sessionStorage.getItem('userId'));
    let others = [];
    let isOverride = false;
    // check if user has an account in the lobby already
    this.getLobbyPlayers().pipe(take(1)).subscribe(otherPlayers => {
      others = Array.from(otherPlayers);

      isOverride = otherPlayers.findIndex(player => player.uniqueId === userId) !== -1;
      if (isOverride) {
        this.socket.emit('override user', user);
      } else {
        this.socket.emit('add new user', user);
      }
      this.socket.fromEvent<any>('joining lobby')
        .pipe(take(1))
        .subscribe(joiningLobby => {
          if (joiningLobby === 401) {
            this.router.navigate(['soz-gotta-wait-a-bit']);
          } else {
            const enemies = JSON.stringify(
              joiningLobby.players.filter(player =>
                player.uniqueId !== joiningLobby.user.uniqueId
              ));
            sessionStorage.setItem('user', JSON.stringify(joiningLobby.user));
            sessionStorage.setItem(
              'otherPlayers',
              enemies
            );
            this.router.navigate(['lobby']);
          }
        });
    });
  }

  getLobbyPlayers(): Observable<Player[]> {
    this.socket.emit('get lobby players');
    return this.socket.fromEvent<Player[]>('lobby players');
  }
  listenForNewPlayers(): Observable<Player> {
    return this.socket.fromEvent<Player>('user joined');
  }
  listenForUpdatedPlayer(): Observable<UpdatedPlayer> {
    return this.socket.fromEvent<UpdatedPlayer>('player updated');
  }
  goToGameListener(isHost: boolean): Observable<any> {
    return isHost ? of() : this.socket.fromEvent<any>('go to game');
  }


  updatePlayer(player: Player): void {
    this.socket.emit('update player', player);
  }

  // Start Game
  startGame(): void {
    this.socket.emit('start game');
    this.router.navigate(['game']);
  }

  private createUniqueId() {
    let candidateId = Math.floor(Math.random() * 1000);
    let isGood = false;
    this.getLobbyPlayers().pipe(take(1)).subscribe(otherPlayers => {
      while (!isGood) {
        if (otherPlayers.findIndex(player => player.uniqueId === candidateId) === -1) {
          isGood = true;
        } else {
          candidateId = Math.floor(Math.random() * 1000);
        }
      }
    });
    return candidateId;
  }
}
