import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Animations } from '../../../game-src/animations/animations';
import { Hand } from '../../../interfaces/card.interface';
import { RoundType } from '../../../interfaces/round.interface';

@Component({
  selector: 'doc-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  animations: [ Animations.cardAnimation ]
})
export class CardsComponent {
  @Input() cards: Hand;
  @Input() roundType: RoundType = 'first';
  @Input() winnerId = null;
  @Input() roundPoints = [];

  constructor() {}

  getHeader(card: any, ind: number) {
    if (card.uniqueId === this.winnerId) {
      return 'Winner';
    } else if (ind === 0) {
      return 'First';
    } else {
      return '';
    }
  }
  getPoint(card: any): string {
    const out = this.roundPoints.find(el => el.id === card.uniqueId);
    if (out === void 0) {
      throw Error(`Don't know who played this card ${card}`);
    }
    return out.points;
  }
}
