import { Observable, Subject, of } from 'rxjs';
import { Player, UpdatedPlayer } from '../../interfaces/player.interface';
import { take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

interface LandingData {
  numOfPlayers: number;
  isHost?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  landingData: LandingData = {
    numOfPlayers: 0,
    isHost: false
  };
  private unsubscribes = new Subject<void>();
  constructor(
    private socket: Socket,
    private readonly router: Router
  ) { }
  land(): void {
    const id = this.createUniqueId();
    // create uniqueID and store it in session storage if there is none so far
    if (sessionStorage.getItem('userId') === null) {
      sessionStorage.setItem('userId', `${id}`);
    }

    this.socket.emit('landing', id);
    // Set landing data on number of players in the lobby
    this.socket.fromEvent<number>('playerCount').pipe(takeUntil(this.unsubscribes)).subscribe(numOfPlayers => {
      this.landingData = { numOfPlayers };
    });
  }

  // Set current user and handle reloads
  login(user: Player): void {
    this.unsubscribes.next();
    this.unsubscribes.complete();

    const userId = JSON.parse(sessionStorage.getItem('userId'));
    let others = [];
    let isOverride = false;
    // check if user has an account in the lobby already
    this.getLobbyPlayers().pipe(take(1)).subscribe(otherPlayers => {
      others = Array.from(otherPlayers);
      isOverride = otherPlayers.findIndex(player => player.uniqueId === userId) !== -1;
      if (isOverride) {
        this.overrideUser(user);
      } else {
        this.addNewUser(user);
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
  addNewUser(user: Player) {
    this.socket.emit('add new user', user);
  }
  overrideUser(user: Player) {
    
    this.socket.emit('override user', user);
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
