import { Component, Input, OnInit } from '@angular/core';

import { Card } from '../../interfaces/card.interface';
import { IconService } from '../../services/helper-services/icon.service';

@Component({
  selector: 'asr-round-pile',
  templateUrl: './round-pile.component.html',
  styleUrls: ['./round-pile.component.scss']
})
export class RoundPileComponent implements OnInit {
  @Input() trump: Card;
  @Input() set cardOnTop(val: Card) {
    console.log(val);
    if (!val) {
      this._cards = [];
      this.justPlayedCard = null;
      this.trump = null;
    } else {
      this.isLoading = true;
      this.justPlayedCard = Object.assign({}, val);
      this._cards.push(this.justPlayedCard);
      console.log(this._cards);
      if (this._cards.length === 1) {
        this.base = Object.assign({}, this.justPlayedCard);
        this.baseImgSrc = this.iconService.getIconSrcFromId(this.base.uniqueId);
        this.winnerCard = Object.assign({}, this.justPlayedCard);
        this.winnerImgSrc = this.iconService.getIconSrcFromId(this.winnerCard.uniqueId);
      } else {
        this.determineWinnerCardSoFar();
      }
    }
    this.isLoading = false;
  }
  @Input() set pileReset(val: Array<Card>) {
    if (val !== null) {
      val.forEach(el => {
        this.cardOnTop = el;
      });
    }
  }
  get cardOnTop(): Card {
    return this.justPlayedCard;
  }



  justPlayedCard: Card;
  winnerCard: Card;
  winnerImgSrc: string;

  base: Card;
  baseImgSrc: string;
  isLoading = true;

  private _cards: Array<Card> = [];
  constructor(private readonly iconService: IconService) { }

  ngOnInit(): void {}
  determineWinnerCardSoFar(): void {
    const trumps = this._cards.filter(card => card.suit === this.trump.suit);
    const bases = this._cards.filter(card => card.suit === this.base.suit);
    if (trumps.length > 0) {
      this.winnerCard = this.winnerOfPile(trumps);
    } else {
      this.winnerCard = this.winnerOfPile(bases);
    }
    this.winnerImgSrc = this.iconService.getIconSrcFromId(this.winnerCard.uniqueId);
  }
  winnerOfPile(cards: Array<Card>): Card {
    let candidate: Card;
    let currMaxVal = 0;
    cards.forEach(card => {
      if (card.value > currMaxVal) {
        currMaxVal = card.value;
        candidate = card;
      }
    });
    return candidate;
  }

}
