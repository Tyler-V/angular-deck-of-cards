import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';

import { MenuService } from '../../services/menu-service/menu.service';
import { Player } from '../../interfaces/player.interface';
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
    const navExtras = this.router.getCurrentNavigation();
    if (navExtras && navExtras.extras.state.players) {
      this.repopulateLobby(navExtras.extras.state.players);
    } else {
      this.getCurrentPlayer();
      this.getLobbyPlayers();
    }
    this.listenForNewPlayers();
    this.listenForUpdatedPlayer();
    this.goToGameListener();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribes.next();
    this.unsubscribes.complete();
  }

  getHostButtonText(): string {
    if (this.currentPlayer.isHost) {
      if (this.currentPlayer.isReady) {
        return this.otherPlayers.findIndex(playa => !playa.isReady) !== -1 ? 'Waiting for others' : 'Start Game!';
      } else {
        return 'Ready!';
      }
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
      this.menu.startGame();
    }
  }
  private getCurrentPlayer(): void {
    this.currentPlayer = JSON.parse(sessionStorage.getItem('user'));
  }

  private listenForNewPlayers() {
    this.menu.listenForNewPlayers().pipe(takeUntil(this.unsubscribes)).subscribe(user => {
      this.safeAdd(user);
    });
  }

  private goToGameListener(): void {
    this.menu.goToGameListener(this.currentPlayer.isHost).pipe(takeUntil(this.unsubscribes)).subscribe(() => {
      this.router.navigate(['game']);
    });
  }

  private listenForUpdatedPlayer() {
    this.menu.listenForUpdatedPlayer().pipe(takeUntil(this.unsubscribes)).subscribe(playerUpdated => {
      const ind = this.otherPlayers.findIndex(player => player.uniqueId === playerUpdated.id);
      if (ind !== -1) {
        this.otherPlayers[ind] = Object.assign({}, playerUpdated.player);
        sessionStorage.setItem('otherPlayers', JSON.stringify(this.otherPlayers));
      }
    });
  }

  private safeAdd(user: any): void {
    // if user is already in the otherPlayers then just return
    if (this.otherPlayers.findIndex(player => player.uniqueId === user.uniqueId) !== -1) {
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

  private repopulateLobby(players: Player[]): void {
    // get current player
    const uniqueId = JSON.parse(sessionStorage.getItem('userId')) as number;
    this.currentPlayer = Object.assign({}, players.find(playa => playa.uniqueId === uniqueId));
    // get others in too
    this.otherPlayers = players.filter(player => player.uniqueId !== uniqueId);
      sessionStorage.setItem(
        'otherPlayers',
        JSON.stringify(this.otherPlayers));
  }
}
