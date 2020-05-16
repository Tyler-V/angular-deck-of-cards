import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Card } from '../../../../shared/models/card.model';
import { IconService } from '../../../../services/helper-services/icon.service';

@Component({
  selector: 'doc-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() public card: any;
  @Input() isFirstRound = false;
  imgSrc = '';
  cardName = '';
  cardToDisplay: Card;

  constructor(private readonly iconService: IconService) {}
  ngOnInit(): void {
    if (this.isFirstRound) {
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
    // image source
    const title = user.iconTitle;
    this.imgSrc = this.iconService.getIconSrc(title);
    // name
    this.cardName = user.username;

  }
}
