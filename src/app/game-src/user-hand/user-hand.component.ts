import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { GameService } from '../../services/game-service/game.service';

@Component({
  selector: 'asr-user-hand',
  templateUrl: './user-hand.component.html',
  styleUrls: ['./user-hand.component.scss']
})
export class UserHandComponent {
  @Input() cards: any[];
  @Input() base: any;
  @Input() trump: any;
  @Input() isFirstRound: boolean;
  @Input() canPlay: boolean;
  @Output() justPlayed: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly gameService: GameService) { }

  playCard(data: any): void {
    if (this.canPlay && !this.isFirstRound) {
      this.gameService.playCard(data.card);
      this.cards.splice(data.ind, 1);
      this.justPlayed.emit(data.card);
    }
  }
  canPlayCard(card: any): boolean {
    return card.suite === this.base.suite || card.suite === this.trump.suite;
  }
}
