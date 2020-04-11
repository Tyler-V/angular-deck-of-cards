import { Component, OnInit } from '@angular/core';

import { Card } from 'src/app/shared/models/card.model';
import { Suit } from 'src/app/shared/models/suit.model';

@Component({
  selector: 'asr-round-pile',
  templateUrl: './round-pile.component.html',
  styleUrls: ['./round-pile.component.scss']
})
export class RoundPileComponent implements OnInit {
  cardOnTop: Card = {
    name: '2',
    value: 2,
    suit: Suit.Club
  };
  constructor() { }

  ngOnInit(): void {
  }

}
