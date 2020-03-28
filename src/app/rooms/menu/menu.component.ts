import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu-service/menu.service';
import { Player } from '../interfaces/player.interface';

@Component({
  selector: 'doc-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  player: Player = {
    uniqueId: 123456789
  };
  playersInRoom = 5;
  constructor(private readonly menu: MenuService) { }

  ngOnInit(): void {
    this.menu.currentPlayer.subscribe(player => {
      this.player = player;
    });
  }

}
