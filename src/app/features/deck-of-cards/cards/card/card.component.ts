import { Component, Input, OnInit } from '@angular/core';

import { Card } from '../../../../shared/models/card.model';
import { IconService } from 'src/app/services/helper-services/icon.service';

@Component({
  selector: 'doc-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() public card: any;
  @Input() isFirstRound = false;
  imgSrc = '';
  cardName = '';
  cardToDisplay: Card;

  constructor(private readonly iconService: IconService) {}
  ngOnInit(): void {
    console.log(this.card);
    if (this.isFirstRound) {
      this.getInfo(this.card.uniqueId);
      this.cardToDisplay = this.card.hand[0];
    } else {
      this.cardToDisplay = this.card;
    }
    console.log(this.cardToDisplay);
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
