import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


interface LandingData {
  numOfPlayers: number;
}
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  landingData: LandingData = {
    numOfPlayers: 0
  };
  constructor(private socket: Socket) {}

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
    this.socket.fromEvent<number>('login').subscribe(numOfPlayers => {
      this.landingData = { numOfPlayers };
    });
  }
}
