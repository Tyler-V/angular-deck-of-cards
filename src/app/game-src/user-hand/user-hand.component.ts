import { Card, Hand } from '../../interfaces/card.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OthersHand, RoundType } from '../../interfaces/round.interface';

import { Animations } from '../animations/animations';
import { GameService } from '../../services/game-service/game.service';

@Component({
  selector: 'asr-user-hand',
  templateUrl: './user-hand.component.html',
  styleUrls: ['./user-hand.component.scss'],
  animations: [ Animations.cardAnimation ]
})
export class UserHandComponent implements OnInit {
  @Input() set cards(newHand: Hand) {
    if (this.roundType === 'normal') {
      this._hand = newHand as Array<Card>;
    } else {
      this._hand = newHand as Array<OthersHand>;
    }
  }
  get cards(): Hand {
    return this._hand;
  }
  @Input() base: Card;
  @Input() trump: Card;
  @Input() roundType: RoundType = 'first';
  @Input() canPlay: boolean;
  @Output() justPlayed: EventEmitter<Card> = new EventEmitter<Card>();
  private _hand: Hand = [];
  constructor(private readonly gameService: GameService) { }

  ngOnInit(): void {}

  playCard(card: Card, ind: number): void {
    console.log('base was ', this.base);
    console.log('trump was ', this.base);

    if (this.canPlay && this.roundType === 'normal') {
      if (this.canPlayCard(card)) {
        this.gameService.playCard(card);
        this.cards.splice(ind, 1);
        this.base = null;
        this.cards = Array.from(this.cards as Array<Card>);
        this.justPlayed.emit(card);
      }
    }
  }
  canPlayCard(card: Card): boolean {
    if (this.roundType !== 'normal' || !this.canPlay) {
      return false;
    } else if (!this.base) {
      return true;
    } else {
      const hasBase = this.cards.some(caerd => caerd.suit === this.base.suit);
      if (!hasBase) {
        return true;
      } else {
        return card.suit === this.base.suit;
      }
    }
  }
}
