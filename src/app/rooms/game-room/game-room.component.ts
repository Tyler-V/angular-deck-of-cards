import { Component, OnInit } from '@angular/core';

import { Card } from 'src/app/shared/models/card.model';
import { Suit } from 'src/app/shared/models/suit.model';

@Component({
  selector: 'doc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  cardOnTop: Card = {
    name: '2',
    value: 2,
    suit: Suit.Club
  };
  rankedPlayers = [
    {
      rank: 1,
      name: 'Soma',
      points: 100
    },
    {
      rank: 2,
      name: 'Apa',
      points: 50
    },
    {
      rank: 3,
      name: 'Anya',
      points: 20
    }
  ];

  scoreboardToggle = true;
  constructor() { }

  ngOnInit(): void {
  }

  toggleScorePanel(): void {
    this.scoreboardToggle = !this.scoreboardToggle;
  }
}
