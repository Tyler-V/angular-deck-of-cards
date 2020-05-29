import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Card } from '../../../../interfaces/card.interface';
import { IconService } from '../../../../services/helper-services/icon.service';
import { RoundType } from '../../../../interfaces/round.interface';

@Component({
  selector: 'doc-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() public card: Card;
  @Input() roundType: RoundType = 'first';
  imgSrc = '';
  cardName = '';
  cardToDisplay: Card;

  constructor(private readonly iconService: IconService) {}
  ngOnInit(): void {
    if (this.roundType !== 'normal' && this.card.hand) {
      this.getInfo(this.card.uniqueId);
      this.cardToDisplay = this.card.hand[0];
    } else {
      this.cardToDisplay = this.card;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card']) {
      this.cardToDisplay = Object.assign({}, this.card);
    }
  }

  private getInfo(id: number) {
    let user = JSON.parse(sessionStorage.getItem('otherPlayers')).find(player => player.uniqueId === id);
    if (user === void 0) {
      user = JSON.parse(sessionStorage.getItem('user'));
    }
    const title = user.iconTitle;
    this.imgSrc = this.iconService.getIconSrc(title);
    this.cardName = user.username;
  }
}
