import { Component, OnInit } from '@angular/core';

import { BettingModalComponent } from 'src/app/game-src/betting-modal/betting-modal.component';
import { Card } from 'src/app/shared/models/card.model';
import { GameService } from 'src/app/services/game-service/game.service';
import { MatDialog } from '@angular/material/dialog';
import { Round } from 'src/app/interfaces/round.interface';
import { Suit } from 'src/app/shared/models/suit.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'doc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  cardOnTop: Card = {
    name: '2',
    value: 2,
    suit: 'club'
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
  isLoading = true;
  roundData: Round;
  scoreboardToggle = true;
  constructor(
    public dialog: MatDialog,
    private readonly gameService: GameService
  ) { }

  ngOnInit(): void {
    this.initRound();
  }
  openModal(): void {
    const modalRef = this.dialog.open(BettingModalComponent, {
      width: '500px',
      panelClass: 'modal'
    });
  }
  toggleScorePanel(): void {
    this.scoreboardToggle = !this.scoreboardToggle;
  }
  private initRound(): void {
    this.gameService.getCurrentRound().pipe(take(1)).subscribe(round => {
      this.gameService.initRound(round).pipe(take(1)).subscribe(roundData => {
        this.roundData = roundData;
        this.initUiComponents();
        this.isLoading = false;
      });
    });
  }
  private initUiComponents(): void {
    console.log(this.roundData);
    console.log(this.cardOnTop);
    this.cardOnTop = Object.assign({}, this.roundData.trumpCard);
    console.log(this.cardOnTop);
  }

}
