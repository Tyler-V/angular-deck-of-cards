import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu-service/menu.service';
import { Player } from '../../interfaces/player.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'doc-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  player: Player = {
    username: ''
  };
  playersInRoom = 5;
  isJoining: boolean;
  constructor(
    readonly menu: MenuService,
    private readonly router: Router
    ) { }

  ngOnInit(): void {
    this.menu.land();
    // this.menu.currentPlayer.subscribe(player => {
    //   this.player = player;
    // });
    // this.menu.allPlayers.subscribe(players => {
    //   this.playersInRoom = players.length;
    // });
  }
  joinGame(): void {
    this.isJoining = true;
    this.menu.addUser(this.player.username);
  }
}
