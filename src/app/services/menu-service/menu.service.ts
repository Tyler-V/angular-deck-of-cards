import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { Player } from '../../interfaces/player.interface';
import { Observable } from 'rxjs';


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
    ) {}

  land(): void {
    // tell server to throw me the landing page data
    this.socket.emit('landing');
    // grab that boi
    this.socket.fromEvent<number>('playerCount').subscribe(numOfPlayers => {
      this.landingData = { numOfPlayers };
    });
  }

  addUser(username: string): void {
    this.socket.emit('add user', username);
    this.socket.fromEvent<LandingData>('login').subscribe(landingData => {
      this.landingData = { numOfPlayers: landingData.numOfPlayers, isHost: landingData.isHost };
      sessionStorage.setItem('user', `{ "username": "${username}", "isHost": ${landingData.isHost} }`);
      this.router.navigate(['lobby']);
    });
  }

  getLobbyPlayers(): Observable<{players: Player[]}> {
    this.socket.emit('get lobby players');
    return this.socket.fromEvent<{players: Player[]}>('lobby players');
  }
  listenForNewPlayers(): void {
    this.socket.fromEvent<any>('user joined').subscribe(user => {
      console.log(user);
    });
  }
}
