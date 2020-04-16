import { Bet, Round } from 'src/app/interfaces/round.interface';
import { Component, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';

import { BettingModalComponent } from 'src/app/game-src/betting-modal/betting-modal.component';
import { Card } from 'src/app/shared/models/card.model';
import { GameService } from 'src/app/services/game-service/game.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'doc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  cardOnTop: Card;
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
  currentRound = 1;
  currentHand: any;
  betsHolder: Bet[] = [];

  userInfo = 'Look at the opponent hands, and make your bet!';
  trumpoCard: Card;
  isLoading = true;
  roundData: Round;
  scoreboardToggle = true;
  bettingOptions: number[];

  userId: number;
  private unsubscribez = new Subject<any>();
  constructor(
    public dialog: MatDialog,
    private readonly gameService: GameService
  ) { }

  ngOnInit(): void {
    this.initRound();
  }
  openBettingModal(isDealerRebet?: boolean): void {
    const modalRef = this.dialog.open(BettingModalComponent, {
      width: '500px',
      panelClass: 'modal',
      hasBackdrop: false,
      disableClose: true,
      position: {
        top: '8vh'
      },
      data: {
        bettingOptions: this.bettingOptions
      }
    });
    console.log(this.bettingOptions);
    modalRef.afterClosed().pipe(take(1)).subscribe(bet => {
      this.roundData.me.bets.bet = bet;
      this.roundData.me.bets.bettingOptions = this.bettingOptions;
      if (isDealerRebet) {
        this.gameService.changeDealerBet(bet);
      } else {
        this.gameService.makeBet(this.roundData.me.bets, this.userId);
      }
    });
  }
  toggleScorePanel(): void {
    this.scoreboardToggle = !this.scoreboardToggle;
  }
  private initRound(): void {
    this.gameService.getCurrentRound().pipe(take(1)).subscribe(round => {
      this.currentRound = round;
      this.gameService.initRound(round).pipe(take(1)).subscribe(roundData => {
        this.roundData = roundData;
        this.userId = this.roundData.me.uniqueId;
        console.log(this.roundData);
        this.initUiComponents();
        this.isLoading = false;
        // Make fn to decide what's happening ie spectating or round didnt start yet
        this.openBettingModal();
        this.initBettingListeners();
      });
    });
  }
  private initUiComponents(): void {
    this.currentHand = Array.from(this.roundData.myHand.firstRoundHand);
    this.trumpoCard = Object.assign({}, this.roundData.trumpCard);
    this.bettingOptions = this.roundData.myBets.bettingOptions;
  }
  private initBettingListeners(): void {
    if (this.roundData.me.isDealer) {
      console.log('im the dealer so im listening');
      this.listenForDealerInstruction();
    }
    this.listenForOthersMakingBet();
    this.listenForReveal();
  }
  private listenForDealerInstruction(): void {
    this.gameService.listenForDealerRebet()
      .pipe(take(1))
      .subscribe(bettingOptions => {
        console.log(bettingOptions);
        this.bettingOptions = bettingOptions;
        this.openBettingModal(true);
    });
  }
  private listenForOthersMakingBet(): void {
    this.gameService.listenForPlayerMakingBet()
      .pipe(takeUntil(this.unsubscribez)) //<-- needs to be a subject
      .subscribe((playerBet: Bet) => {
        const ind = this.roundData.players.findIndex(player => player.uniqueId === playerBet.uniqueId);
        if (ind > -1) {
          this.betsHolder.push(Object.assign({}, playerBet));
          console.log('bets holder', this.betsHolder);
        }
      });
  }
  private listenForReveal(): void {
    this.gameService.listenForReveal()
      .pipe(take(1))
      .subscribe((roundBets) => {
        console.log(roundBets);
        this.roundData.players.forEach((_, ind, arr) => {
          const playerInd = this.betsHolder.findIndex(bet => bet.uniqueId === _.uniqueId);
          this.roundData.players[ind].bets = Object.assign({}, this.betsHolder[playerInd]);
        });

        this.unsubscribez.next();
        this.unsubscribez.complete();
      });
  }

}
