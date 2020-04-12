import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';

import { MenuService } from 'src/app/services/menu-service/menu.service';
import { Player } from 'src/app/interfaces/player.interface';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'doc-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.scss'],
})
export class LobbyRoomComponent implements OnInit, OnDestroy {
  otherPlayers: Player[] = [];
  currentPlayer: Player;
  isLoading = true;
  private unsubscribes = new Subject<void>();
  constructor(
    private readonly menu: MenuService,
    private readonly router: Router
    ) { }

  ngOnInit(): void {
    this.getCurrentPlayer();
    this.getLobbyPlayers();
    this.listenForNewPlayers();
    this.listenForUpdatedPlayer();
    this.goToGameListener();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    console.log('here');
    this.unsubscribes.next();
    this.unsubscribes.complete();
  }

  getHostButtonText(): string {
    if (this.currentPlayer.isHost) {
      return this.currentPlayer.isReady ? 'Start Game!' : 'Ready';
    }
    return this.currentPlayer.isReady ? 'Waiting for host' : 'Ready!';
  }

  trackByFn(index, item) {
    return index;
  }

  playerIconChanged(e: any): void {
    this.currentPlayer.iconTitle = e;
    sessionStorage.setItem('user', JSON.stringify(this.currentPlayer));
    this.menu.updatePlayer(this.currentPlayer);
  }

  setReady(): void {
    this.currentPlayer.isReady = true;
    sessionStorage.setItem('user', JSON.stringify(this.currentPlayer));
    this.menu.updatePlayer(this.currentPlayer);
  }

  startGame(): void {
    if (this.currentPlayer.isHost) {
      console.log('im a host so i can start the game');
      this.menu.startGame();
    }
  }
  private getCurrentPlayer(): void {
    this.currentPlayer = JSON.parse(sessionStorage.getItem('user'));
  }

  private listenForNewPlayers() {
    this.menu.listenForNewPlayers().pipe(takeUntil(this.unsubscribes)).subscribe(user => {
      console.log('someone joined');
      this.safeAdd(user);
    });
  }

  private goToGameListener(): void {
    this.menu.goToGameListener().pipe(takeUntil(this.unsubscribes)).subscribe(() => {
      this.router.navigate(['game']);
    });
  }

  private listenForUpdatedPlayer() {
    this.menu.listenForUpdatedPlayer().pipe(takeUntil(this.unsubscribes)).subscribe(playerUpdated => {
      console.log('someone got updated');
      const ind = this.otherPlayers.findIndex(player => player.uniqueId === playerUpdated.id);
      if (ind !== -1) {
        this.otherPlayers[ind] = Object.assign({}, playerUpdated.player);
        sessionStorage.setItem('otherPlayers', JSON.stringify(this.otherPlayers));
      }
    });
  }

  private safeAdd(user: any): void {
    // if user is already in the otherPlayers then just return
    if (this.otherPlayers.findIndex(player => player.username === user.username) !== -1) {
      return;
    }
    // add to sessionStorage
    this.otherPlayers.push(user);
    sessionStorage.setItem('otherPlayers', JSON.stringify(this.otherPlayers));
  }

  private getLobbyPlayers(): void {
    this.menu.getLobbyPlayers().pipe(take(1)).subscribe(players => {
      this.otherPlayers = players.filter(player => this.currentPlayer.username !== player.username);
      sessionStorage.setItem(
        'otherPlayers',
        JSON.stringify(this.otherPlayers));
    });
  }
}
