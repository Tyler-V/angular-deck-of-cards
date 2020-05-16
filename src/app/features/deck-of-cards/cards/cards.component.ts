import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Animations } from '../../../game-src/animations/animations';

@Component({
  selector: 'doc-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  animations: [ Animations.cardAnimation ]
})
export class CardsComponent implements OnInit {
  @Input() cards: any[];
  @Input() isFirstRound = false;
  @Input() isResult = false;
  @Input() winnerId = null;
  @Input() roundPoints = [];
  @Input() canPlay = false;
  @Output() cardPlayed: EventEmitter<any> = new EventEmitter<any>();
  cardsLen = 0;

  constructor() {}
  ngOnInit(): void {}

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

  emitCard(card: any, ind: number): void {
    this.cardPlayed.emit({card, ind});
  }
}
