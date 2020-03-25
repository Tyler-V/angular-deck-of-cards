import { Component } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'doc-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private readonly game: GameService) {
    this.game.documents.subscribe(players => {
      console.log(players);
    });
  }
}
