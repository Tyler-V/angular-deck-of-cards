import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'doc-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('.75s cubic-bezier(0.215, 0.61, 0.355, 1)',
            keyframes([
              style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0 }),
              style({ opacity: 0.2, transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
              style({ opacity: 0.4, transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
              style({ opacity: 0.6, transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
              style({ opacity: 0.8, transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
              style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1.0 }),
            ]))]), { optional: true })
      ])
    ])

  ]
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
      return 'helloooooo';
    }
    return out.points;
  }

  emitCard(card: any, ind: number): void {
    this.cardPlayed.emit({card, ind});
  }
}
