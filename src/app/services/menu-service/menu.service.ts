import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { Player, UpdatedPlayer } from '../../interfaces/player.interface';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';



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
  constructor(
    private socket: Socket,
    private readonly router: Router
  ) { }
  // call this when landing on home page
  land(): void {
    const id = this.createUniqueId();
    // create uniqueID and store it in session storage if there is none so far
    if (sessionStorage.getItem('userId') === null) {
      sessionStorage.setItem('userId', `${id}`);
    }

    this.socket.emit('landing', id);
    // Set landing data on number of players in the lobby
    this.socket.fromEvent<number>('playerCount').subscribe(numOfPlayers => {
      this.landingData = { numOfPlayers };
    });
  }

  // Set current user and handle reloads
  login(user: Player): void {
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
        });
    });
  }
  addNewUser(user: Player) {
    this.socket.emit('add new user', user);
    console.log('adding new user');
  }
  overrideUser(user: Player) {
    console.log('override a lobby user');
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

  updatePlayer(player: Player): void {
    this.socket.emit('update player', player);
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
