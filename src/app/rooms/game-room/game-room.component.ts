import { Bet, Round } from 'src/app/interfaces/round.interface';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { first, take, takeUntil } from 'rxjs/operators';

import { Animations } from 'src/app/game-src/animations/animations';
import { BettingModalComponent } from 'src/app/game-src/betting-modal/betting-modal.component';
import { Card } from 'src/app/shared/models/card.model';
import { FirstRoundModalComponent } from 'src/app/game-src/first-round-modal/first-round-modal.component';
import { GameService } from 'src/app/services/game-service/game.service';
import { RoundResultModalComponent } from 'src/app/game-src/round-result-modal/round-result-modal.component';
import { Subject } from 'rxjs';

const modalBaseConfig: MatDialogConfig = {
  width: '700px',
  panelClass: 'modal',
  hasBackdrop: false,
  disableClose: true,
  position: {
    top: '8vh'
  },
};

@Component({
  selector: 'doc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
  animations: [ Animations.roundInit ]
})
export class GameRoomComponent implements OnInit {
  animTrigger = 'initial';
  isAnimationDone = false;
  isLoading = true;

  cardOnTop: Card;
  rankedPlayers = [];
  currentRound = 1;
  currentHand: any;

  userInfo = 'Look at the opponent hands, and make your bet!'; // <- still to do
  trumpoCard: Card;
  roundData: Round;
  scoreboardToggle = true;
  bettingOptions: number[];
  canPlay = false;
  idPivot = 0;

  roundResultModalRef: MatDialogRef<RoundResultModalComponent>;

  userId: number;
  private unsubscribez = new Subject<any>();
  constructor(
    public dialog: MatDialog,
    private readonly gameService: GameService,
  ) { }

  ngOnInit(): void {
    // check round first -> if round already started -> wait till over and listen for players LATER
    this.initFirstRound();
    // init any round comes here
  }
  justPlayedCard(card) {
    this.canPlay = false;
    this.cardOnTop = Object.assign({}, card);
  }
  // MODALS
  openFirstRoundModal(firstRoundData: any): void {
    const modalRef = this.dialog.open(FirstRoundModalComponent, {
      ...modalBaseConfig,
      data: {
        ...this.roundData,
        firstRoundData
      }
    });
    modalRef.afterClosed().pipe(take(1)).subscribe((roundFromModal) => {
      if (this.roundData.me.isHost) {
        this.gameService.initNextRound().pipe(take(1)).subscribe(round => {
          this.initNextRound(round);
        });
      } else {
        this.initNextRound(roundFromModal);
      }
    });
  }
  openBettingModal(isDealerRebet?: boolean): void {
    const modalRef = this.dialog.open(BettingModalComponent, {
      ...modalBaseConfig,
      id: `round-bets-${isDealerRebet ? 'delear-rebet-' + this.idPivot : this.idPivot}`,
      data: {
        bettingOptions: this.bettingOptions
      }
    });
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
  openRoundResultModal(roundBets: any[]): void {
    this.roundResultModalRef = this.dialog.open(RoundResultModalComponent, {
      ...modalBaseConfig,
      id: `round-result-${this.idPivot}`,
      data: {roundBets, currRound: this.currentRound, roundData: this.roundData}
    });

    this.roundResultModalRef.afterClosed().pipe(take(1)).subscribe((roundFromModal) => {
      console.log('here after closed');
      if (this.roundData.me.isHost) {
        this.gameService.initNextRound().pipe(take(1)).subscribe(round => {
          this.initNextRound(round);
        });
      } else {
        this.initNextRound(roundFromModal);
      }
    });
  }
  toggleScorePanel(): void {
    this.scoreboardToggle = !this.scoreboardToggle;
  }
  private initNextRound(round: number): void {
    this.isLoading = true;
    this.idPivot++;
    this.initRoundAnimation();
    this.currentRound = round;
    // close all result modals
    this.gameService.initRound(round).pipe(take(1)).subscribe(roundData => {
      this.roundData = roundData;
      this.currentHand = Array.from(this.roundData.myHand.myHand.hand);
      this.trumpoCard = Object.assign({}, this.roundData.trumpCard);
      this.bettingOptions = this.roundData.myBets.bettingOptions;
      this.initBettingListeners();
    });
    // start loading
  }
  private initFirstRound(): void {
    this.isLoading = true;
    this.initRoundAnimation();
    this.gameService.getCurrentRound().pipe(take(1)).subscribe(round => {
      this.currentRound = round;
      // handling of reload comes here later for now its trashy
      this.gameService.initRound(round).pipe(take(1)).subscribe(roundData => {
        this.roundData = roundData;
        this.userId = this.roundData.me.uniqueId;
        this.initUiComponents();
        this.isLoading = false;
        // Make fn to decide what's happening ie spectating or round didnt start yet
        this.initBettingListeners();
      });
    });
  }
  private initUiComponents(): void {
    this.currentHand = this.currentRound === 1
      ? Array.from(this.roundData.myHand.firstRoundHand)
      : Array.from(this.roundData.myHand.myHand.hand);
    this.trumpoCard = Object.assign({}, this.roundData.trumpCard);
    this.bettingOptions = this.roundData.myBets.bettingOptions;
    const others = this.roundData.players.map(playa => {
      return {
        name: playa.username,
        uniqueId: playa.uniqueId,
        points: 0
      };
    });
    this.rankedPlayers = [...others, {name: this.roundData.me.username, uniqueId: this.roundData.me.uniqueId, points: 0}];
  }
  private initRoundAnimation(): void {
    this.isAnimationDone = false;
    this.animTrigger = this.animTrigger === 'initial' ? 'final' : 'initial';

    setTimeout(() => {
      this.isAnimationDone = true;
      this.openBettingModal();
    }, 2000);
  }
  private initBettingListeners(): void {
    if (this.roundData.me.isDealer) {
      this.listenForDealerInstruction();
    }
    if (this.currentRound === 1) {
      this.listenForRound1();
    }
    this.listenForOthersMakingBet();
    this.listenForReveal();
  }
  private listenForDealerInstruction(): void {
    this.gameService.listenForDealerRebet()
      .pipe(takeUntil(this.unsubscribez))
      .subscribe(bettingOptions => {
        this.bettingOptions = bettingOptions;
        this.openBettingModal(true);
    });
  }
  private listenForOthersMakingBet(): void {
    this.gameService.listenForPlayerMakingBet()
      .pipe(takeUntil(this.unsubscribez)) // <-- needs to be a subject
      .subscribe((playerBet: Bet) => {
        const ind = this.roundData.players.findIndex(player => player.uniqueId === playerBet.uniqueId);
        if (ind > -1) {
          this.roundData.players[ind].status = 'Done!';
        }
      });
  }
  private listenForReveal(): void {
    this.gameService.listenForReveal()
      .pipe(take(1))
      .subscribe((roundBets) => {
        this.roundData.players.forEach((_, ind, arr) => {
          const playerInd = roundBets.findIndex(bet => bet.uniqueId === _.uniqueId);
          this.roundData.players[ind].bets = Object.assign({}, roundBets[playerInd]);
        });
        this.listenForOthersPlayingCard();
        this.listenForHitWinner();
        this.listenForRoundEnd();
        // if ure first then enable playing
        if (this.roundData.me.isFirst) {
          this.canPlay = true;
        }
      });
  }
  private listenForRound1(): void {
    this.gameService.listenForRound1Results()
      .pipe(take(1))
      .subscribe(roundData => {
        this.rankedPlayers.forEach(playa => {
          playa.points = roundData.scoreboard.find(user => user.uniqueId === playa.uniqueId).points;
        });
        this.openFirstRoundModal(roundData);
      });
  }
  private listenForOthersPlayingCard(): void {
    this.gameService.listenForOthersPlayingCard()
      .pipe(takeUntil(this.unsubscribez))
      .subscribe(data => {
        // card and nextId should come
        // update top card
        this.cardOnTop = Object.assign({}, data.card);
        // let player play card if its their nextId
        if (this.userId === data.nextId) {
          this.canPlay = true;
          // get available cards
        } else {
          console.log('next to play: ', data.nextId);
          // update status
        }
      });
  }
  private listenForHitWinner(): void {
    this.gameService.listenForHitWinner()
      .pipe(takeUntil(this.unsubscribez))
      .subscribe(data => {
        this.cardOnTop = {};
        // if u won u start
        if (data.winnerId === this.userId) {
          this.canPlay = true;
        } else {
          this.canPlay = false;
        }
      });
  }
  private listenForRoundEnd(): void {
    this.gameService.listenForRoundEnd()
      .pipe(first())
      .subscribe(data => {
        console.log(data);
        // round results displayed
        this.openRoundResultModal(data.roundBets);
      });
  }
}
