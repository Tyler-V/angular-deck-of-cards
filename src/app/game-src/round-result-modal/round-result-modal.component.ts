import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { GameService } from '../../services/game-service/game.service';

@Component({
  selector: 'asr-round-result-modal',
  templateUrl: './round-result-modal.component.html',
  styleUrls: ['./round-result-modal.component.scss']
})
export class RoundResultModalComponent implements OnInit {
  currRound: number;
  roundBets: any[];
  roundData: any;
  isHost = false;
  isLoading = true;
  roundPoints: any[];
  results: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<RoundResultModalComponent>,
    private readonly gameService: GameService
  ) {
    this.roundBets = data.roundBets;
    this.currRound = data.currRound;
    this.roundData = data.roundData;
   }

  ngOnInit(): void {
    this.isHost = JSON.parse(sessionStorage.getItem('user')).isHost;
    this.roundPoints = this.getRoundPoints();
    this.results = this.getResults();
    // set up listener if not a host
    if (!this.isHost) {
      this.gameService.listenForNextRound().pipe(take(1)).subscribe(round => {
        this.dialogRef.close(round);
      });
    }
    this.isLoading = false;
  }

  startNextRound(): void {
    this.dialogRef.close();
  }
  getRoundPoints(): any[] {
    const out = [];
    this.roundBets.forEach(bet => {
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
  private getResults(): any[] {
    const out = [];
    this.roundBets.forEach(bet => {
      const playerInd = this.roundData.players.findIndex(player => player.uniqueId === bet.uniqueId);
      const name = playerInd !== -1 ? this.roundData.players[playerInd].username : this.roundData.me.username;
      const point = this.roundPoints.find(pint => pint.id === bet.uniqueId).points;
      out.push({...bet, name, point});
    });
    return out;
  }
}
