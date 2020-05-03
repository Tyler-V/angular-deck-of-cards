import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Bet, Round } from 'src/app/interfaces/round.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { first, take, takeUntil } from 'rxjs/operators';

import { BettingModalComponent } from 'src/app/game-src/betting-modal/betting-modal.component';
import { Card } from 'src/app/shared/models/card.model';
import { FirstRoundModalComponent } from 'src/app/game-src/first-round-modal/first-round-modal.component';
import { GameService } from 'src/app/services/game-service/game.service';
import { RoundResultModalComponent } from 'src/app/game-src/round-result-modal/round-result-modal.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'doc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
  animations: [
    trigger('RoundInitAnim', [
      state('initial', style({
        transform: 'translateX(-100px)'
      })),
      state('final', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      transition('* => *', animate('1000ms'))
  ])]
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
    this.initFirstRound();
  }
  openFirstRoundModal(firstRoundData: any): void {
    const modalRef = this.dialog.open(FirstRoundModalComponent, {
      width: '700px',
      // height: '70vh',
      panelClass: 'modal',
      hasBackdrop: false,
      disableClose: true,
      position: {
        top: '8vh'
      },
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
  justPlayedCard(card) {
    this.canPlay = false;
    this.cardOnTop = Object.assign({}, card);
  }
  openBettingModal(isDealerRebet?: boolean): void {
    const modalRef = this.dialog.open(BettingModalComponent, {
      width: '700px',
      panelClass: 'modal',
      hasBackdrop: false,
      id: `round-bets-${isDealerRebet ? 'delear-rebet-' + this.idPivot : this.idPivot}`,
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
  openRoundResultModal(roundBets: any[]): void {
    this.roundResultModalRef = this.dialog.open(RoundResultModalComponent, {
      width: '700px',
      // height: '70vh',
      panelClass: 'modal',
      hasBackdrop: false,
      disableClose: true,
      id: `round-result-${this.idPivot}`,
      position: {
        top: '8vh'
      },
      data: {roundBets, currRound: this.currentRound, roundData: this.roundData}
    });

    this.roundResultModalRef.afterClosed().pipe(take(1)).subscribe((roundFromModal) => {
      console.log('here after closed');
      console.log(this.roundResultModalRef);
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
      console.log(roundData);
      this.roundData = roundData;
      this.currentHand = Array.from(this.roundData.myHand.myHand.hand);
      this.trumpoCard = Object.assign({}, this.roundData.trumpCard);
      this.bettingOptions = this.roundData.myBets.bettingOptions;
      console.log('trumpo card is ', this.trumpoCard);
      console.log('my hand is ');
      console.log(this.currentHand);
      this.initBettingListeners();
    });
    // start loading
  }
  private initFirstRound(): void {
    this.isLoading = true;
    this.initRoundAnimation();
    console.log('nowww');
    this.gameService.getCurrentRound().pipe(take(1)).subscribe(round => {
      this.currentRound = round;
      // handling of reload comes here later for now its trashy
      this.gameService.initRound(round).pipe(take(1)).subscribe(roundData => {
        this.roundData = roundData;
        this.userId = this.roundData.me.uniqueId;
        console.log(this.roundData);
        this.initUiComponents();
        this.isLoading = false;
        // Make fn to decide what's happening ie spectating or round didnt start yet
        this.initBettingListeners();
      });
    });
  }
  private initUiComponents(): void {
    this.currentHand = Array.from(this.roundData.myHand.firstRoundHand);
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
      console.log('im the dealer so im listening');
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
        console.log(bettingOptions);
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
        console.log(roundBets);
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
        console.log(roundData);
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
        console.log(data);
        // card and nextId should come
        // update top card
        this.cardOnTop = Object.assign({}, data.card);
        console.log(this.cardOnTop);
        // let player play card if its their nextId
        if (this.userId === data.nextId) {
          console.log('youre next');
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
        console.log(data);
        this.cardOnTop = {};
        // if u won u start
        if (data.winnerId === this.userId) {
          console.log('ure turn to play');
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
