import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { EdgeRoundResult } from '../../interfaces/round.interface';
import { GameService } from '../../services/game-service/game.service';
import { RankedPlayer, Player } from '../../interfaces/player.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'asr-edge-round-modal',
  templateUrl: './edge-round-modal.component.html',
  styleUrls: ['./edge-round-modal.component.scss']
})
export class EdgeRoundModalComponent implements OnInit {
  roundData: EdgeRoundResult;
  rankedPlayers: Array<RankedPlayer> = [];
  isLoading = true;
  isHost = false;
  showEndResult = false;
  cardsToDisplay = [];
  firstId = 0;
  winnerId = 0;
  roundPoints = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: EdgeRoundResult,
    private dialogRef: MatDialogRef<EdgeRoundModalComponent>,
    private readonly gameService: GameService,
    private readonly router: Router
  ) {
    this.roundData = data;
    if (data.rankedPlayers) {
      this.rankedPlayers = data.rankedPlayers;
    }
  }

  ngOnInit(): void {
    this.isHost = JSON.parse(sessionStorage.getItem('user')).isHost;
    this.cardsToDisplay = Array.from(this.getCorrectOrderedCards());
    this.winnerId = this.roundData.firstRoundData.winnerId;
    this.roundPoints = this.getRoundPoints();

    if (this.roundData.firstRoundData.type === 'last' && this.rankedPlayers.length > 0) {
      this.showEndResult = true;
    }
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
      out.push({ points: `${pnts > 0 ? '+' : '-'}${Math.abs(pnts)}`, id: bet.uniqueId });
    });

    return out;
  }
  startNextRound(): void {
    this.dialogRef.close();
  }
  getButtonText(): string {
    if (this.roundData.firstRoundData.type === 'last') {
      return 'Quit';
    } else if (this.isHost) {
      return 'Start next round';
    } else {
      return 'Waiting for host...';
    }
  }
  samePlayers(): void {
    if (this.roundData.firstRoundData.me.isHost) {
      this.gameService.samePlayers().subscribe((roundPlayers: Player[]) => {
        this.router.navigate(['lobby'], { state: { players: roundPlayers } });
      });
    }
  }
  quit(): void {
    if (this.roundData.firstRoundData.me.isHost) {
      this.gameService.quit();
    }
  }

  private getCorrectOrderedCards(): Array<any> {
    const out = [];
    const candidate = this.roundData.firstRoundData.players.find(playa => playa.isFirst);
    if (candidate === void 0) {
      this.firstId = this.roundData.firstRoundData.me.uniqueId;
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
