import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu-service/menu.service';
import { Player } from 'src/app/interfaces/player.interface';

@Component({
  selector: 'doc-lobby-room',
  templateUrl: './lobby-room.component.html',
  styleUrls: ['./lobby-room.component.scss']
})
export class LobbyRoomComponent implements OnInit {
  otherPlayers: Player[] = [];
  currentPlayer: Player;
  constructor(private readonly menu: MenuService) { }

  ngOnInit(): void {
    this.getCurrentPlayer();
    console.log(this.menu.landingData);
    this.menu.getLobbyPlayers().subscribe(players => {
      this.otherPlayers = players.players.filter(player => this.currentPlayer.username !== player.username);
      sessionStorage.setItem('otherPlayers', JSON.stringify(this.otherPlayers));
    });
    this.menu.listenForNewPlayers();
  }
  getHostButtonText(): string {
    return 'Ready!';
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  private getCurrentPlayer(): void {
    this.currentPlayer = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.currentPlayer);
  }
}
