import { Component } from '@angular/core';
import { GameService } from './services/game-service/game.service';

@Component({
  selector: 'doc-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  uniqueId = '#1234567890';
  playersInRoom = 5;

  constructor(private readonly game: GameService) {
    this.game.documents.subscribe(players => {
      console.log(players);
    });
  }
}
