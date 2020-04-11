import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

import { BettingModalComponent } from 'src/app/game-src/betting-modal/betting-modal.component';
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
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    const modalRef = this.dialog.open(BettingModalComponent, {
      width: '500px',
      panelClass: 'modal'
    });
  }

  toggleScorePanel(): void {
    this.scoreboardToggle = !this.scoreboardToggle;
  }
}
