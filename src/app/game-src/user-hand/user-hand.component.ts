import { Component, Input, OnInit } from '@angular/core';
import { Hand, OthersHand } from 'src/app/interfaces/round.interface';

import { Card } from 'src/app/shared/models/card.model';

@Component({
  selector: 'asr-user-hand',
  templateUrl: './user-hand.component.html',
  styleUrls: ['./user-hand.component.scss']
})
export class UserHandComponent implements OnInit {
  @Input() cards: any[];
  constructor() { }

  ngOnInit(): void {
    console.log(this.cards);
  }

}
