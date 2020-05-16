import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Round } from 'src/app/interfaces/round.interface';
import { GameService } from 'src/app/services/game-service/game.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'asr-first-round-modal',
  templateUrl: './first-round-modal.component.html',
  styleUrls: ['./first-round-modal.component.scss']
})
export class FirstRoundModalComponent implements OnInit {
  roundData: Round;
  isLoading = true;
  isHost = false;
  cardsToDisplay = [];
  firstId = 0;
  winnerId = 0;
  roundPoints = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<FirstRoundModalComponent>,
    private readonly gameService: GameService
  ) {
    this.roundData = data;
  }

  ngOnInit(): void {
    
    this.isHost = JSON.parse(sessionStorage.getItem('user')).isHost;
    this.cardsToDisplay = Array.from(this.getCorrectOrderedCards());
    this.winnerId = this.roundData.firstRoundData.winnerId;
    this.roundPoints = this.getRoundPoints();
    // set up listener if not a host
    if (!this.isHost) {
      this.gameService.listenForNextRound().pipe(take(1)).subscribe(round => {
        this.dialogRef.close(round);
      });
    }
    this.isLoading = false;
  }
  getRoundPoints(): any[] {
    const out = [];
    this.roundData.firstRoundData.roundBets.forEach(bet => {
      const diff = Math.abs(bet.bet - bet.hits);
      
      let pnts = 0;
      if (diff === 0) {
        pnts = (10 + (diff * 2));
      } else {
        pnts = (diff * (-2));
      }
      out.push({points: `${pnts > 0 ? '+' : '-'}${Math.abs(pnts)}`, id: bet.uniqueId});
    });
    
    return out;
  }
  startNextRound(): void {
    this.dialogRef.close();
  }
  private getCorrectOrderedCards(): Array<any> {
    const out = [];
    const candidate = this.roundData.players.find(playa => playa.isFirst);
    if (candidate === void 0) {
      this.firstId = this.roundData.me.uniqueId;
    } else {
      this.firstId = candidate.uniqueId;
    }

    out.push(this.roundData.firstRoundData.cards.find(card => card.uniqueId === this.firstId));
    this.roundData
      .firstRoundData
      .cards.filter(card => card.uniqueId !== this.firstId)
      .forEach(card => {
        out.push(card);
      });
    return out;
  }
}
