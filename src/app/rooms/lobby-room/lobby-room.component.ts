import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu-service/menu.service';
import { Player } from 'src/app/interfaces/player.interface';

@Component({
  selector: 'doc-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.scss'],
})
export class LobbyRoomComponent implements OnInit {
  otherPlayers: Player[] = [];
  currentPlayer: Player;
  isLoading = true;

  constructor(private readonly menu: MenuService) { }
  ngOnInit(): void {
    this.getCurrentPlayer();
    this.getLobbyPlayers();
    this.listenForNewPlayers();
    this.listenForUpdatedPlayer();
    this.isLoading = false;
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
    }
  }
  private getCurrentPlayer(): void {
    this.currentPlayer = JSON.parse(sessionStorage.getItem('user'));
  }

  private listenForNewPlayers() {
    this.menu.listenForNewPlayers().subscribe(user => {
      console.log('someone joined');
      this.safeAdd(user);
    });
  }

  private listenForUpdatedPlayer() {
    this.menu.listenForUpdatedPlayer().subscribe(playerUpdated => {
      console.log('someone got updated');
      const ind = this.otherPlayers.findIndex(player => player.uniqueId === playerUpdated.id);
      if (ind !== -1) {
        this.otherPlayers[ind] = Object.assign({}, playerUpdated.player);
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
    this.menu.getLobbyPlayers().subscribe(players => {
      this.otherPlayers = players.filter(player => this.currentPlayer.username !== player.username);
      sessionStorage.setItem(
        'otherPlayers',
        JSON.stringify(this.otherPlayers));
    });
  }
}
