import {
  Bet,
  FirstRoundData,
  Round,
  Round1APIResponse,
  RoundAPIResponse,
  RoundPlayer,
  RoundResult,
  RoundStage,
  RoundType
} from '../../interfaces/round.interface';
import { Card, Hand } from '../../interfaces/card.interface';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { first, take, takeUntil } from 'rxjs/operators';

import { Animations } from '../../game-src/animations/animations';
import { EdgeRoundModalComponent } from '../../game-src/edge-round-modal/edge-round-modal.component';
import { GameService } from '../../services/game-service/game.service';
import { RankedPlayer } from '../../interfaces/player.interface';
import { RoundResultModalComponent } from '../../game-src/round-result-modal/round-result-modal.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const modalBaseConfig: MatDialogConfig = {
  width: '700px',
  panelClass: 'modal',
  hasBackdrop: false,
  disableClose: true,
  position: {
    top: '30vh'
  },
};

@Component({
  selector: 'doc-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
  animations: [Animations.roundInit]
})
export class GameRoomComponent implements OnInit {
  animTrigger = 'initial';
  isAnimationDone = false;
  isLoading = true;

  cardOnTop: Card;
  rankedPlayers: Array<RankedPlayer> = [];
  currentRound = 1;
  currentHand: Hand;
  nextToPlay: RoundPlayer;
  isDealerRebet = false;

  userInfo = 'Look at the opponent hands, and make your bet!';
  trumpoCard: Card;
  roundData: Round;
  scoreboardToggle = false;
  bettingOptions: number[];
  canPlay = false;
  currentRoundModalName = '';
  idPivot = 0;
  baseCard: Card;
  numCardsPlayed = 0;
  roundType: RoundType;
  resetPile: Array<Card> = null;
  roundResultModalRef: MatDialogRef<RoundResultModalComponent>;

  userId: number;
  private bettingSubj = new Subject<any>();
  private playingSubj = new Subject<any>();
  constructor(
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly gameService: GameService,
  ) { }

  ngOnInit(): void {
    this.gameService.ngOnInit();
    this.userId = this.gameService.getUserId();
    this.gameService.getCurrentRound().pipe(take(1)).subscribe(round => {
      this.initNextRound(round);
    });
  }
  justPlayedCard(card: Card) {
    this.canPlay = false;
    this.cardOnTop = Object.assign({}, card);
    this.baseCard = null;
    this.numCardsPlayed++;
    const next = this.roundData.me.seatInd + 1;
    if (next - 1 === this.roundData.players.length) {
      this.userInfo = `It is ${this.roundData.players.find(playa => playa.seatInd === 0).username}'s turn!`;
    } else {
      this.userInfo = `It is ${this.roundData.players.find(playa => playa.seatInd === next).username}'s turn!`;
    }
  }
  // MODALS
  openEdgeRoundModal(firstRoundData: FirstRoundData): void {
    const modalRef = this.dialog.open(EdgeRoundModalComponent, {
      ...modalBaseConfig,
      data: {
        ...this.roundData,
        firstRoundData,
        type: this.roundType
      }
    });
    modalRef.afterClosed().subscribe((roundFromModal) => {
      if (this.roundType === 'last') {
        this.router.navigate(['']);
      } else {
        console.log(this.roundData);
        if (this.roundData.me.isHost) {
          this.gameService.initNextRound().pipe(take(1)).subscribe(round => {
            this.initNextRound(round);
          });
        } else {
          this.initNextRound(roundFromModal);
        }
      }
    });
  }
  openBettingModal(isDealerRebet?: boolean): void {
    if (isDealerRebet) {
      this.userInfo = 'Dealer needs to change their bets!';
    } if (this.currentRound === 1) {
      this.userInfo = 'Look at the opponent hands, and make your bet!';
    } else {
      this.userInfo = `Make your bet! Trump: ${this.trumpoCard.suit}`;
    }
    // slider version
    this.toggleScorePanel();
    // modal version
    // const modalRef = this.dialog.open(BettingModalComponent, {
    //   ...modalBaseConfig,
    //   id: `round-bets-${isDealerRebet ? 'delear-rebet-' + this.idPivot : this.idPivot}`,
    //   data: {
    //     bettingOptions: this.bettingOptions
    //   }
    // });
    // modalRef.afterClosed().subscribe(bet => {
    // });
  }
  handleBet(bet: number): void {
      this.toggleScorePanel();
      this.roundData.me.bets.bet = bet;
      this.roundData.me.bets.bettingOptions = this.bettingOptions;
      this.gameService.makeBet(this.roundData.me.bets, this.isDealerRebet);
  }
  openRoundResultModal(roundBets: any[]): void {
    this.userInfo = 'Round has ended. Host needs to start the next round!';
    this.currentRoundModalName = `round-result-${this.idPivot}`;
    this.isDealerRebet = false;
    this.roundResultModalRef = this.dialog.open(RoundResultModalComponent, {
      ...modalBaseConfig,
      id: this.currentRoundModalName,
      data: { roundBets, currRound: this.currentRound, roundData: this.roundData }
    });

    this.roundResultModalRef.afterClosed().subscribe((roundFromModal) => {
      if (this.roundData.me.isHost) {
        this.gameService.initNextRound().pipe(take(1)).subscribe(round => {
          console.log('we in here mofo', round);
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
  getUserRole(player: RoundPlayer): string {
    if (player.isFirst) {
      return 'First';
    } else if (player.isDealer) {
      return 'Dealer';
    } else {
      return 'None';
    }
  }
  getMyStatus(): string {
    if (this.roundData.me.isFirst) {
      return ' (F)';
    } else if (this.roundData.me.isDealer) {
      return ' (D)';
    } else {
      return '';
    }
  }
  // round init refactor needed cuz its pretty similar!!!
  private  initNextRound(round: number): void {
    console.log('iin intNextRound with', round);
    this.isLoading = true;
    this.idPivot++;
    this.initRoundAnimation();
    this.currentRound = round;
    // close all result modals
    this.gameService.initRound(round).pipe(take(1)).subscribe(response => {
      console.log(response);

      this.allocateRoundData(response);
      this.isLoading = false;
    });
  }
  private getRoundType(resp: RoundAPIResponse): RoundType {
    if (this.currentRound === 1) {
      return 'first';
    } else if (resp.isLastRound) {
      return 'last';
    } else {
      return 'normal';
    }
  }
  private allocateRoundData(response: RoundAPIResponse): void {
    this.roundType = this.getRoundType(response);
    this.roundData = response.roundData;
    this.trumpoCard = Object.assign({}, this.roundData.trumpCard);
    this.cardOnTop = null;
    this.bettingOptions = this.roundData.myBets.bettingOptions;

    switch (this.roundType) {
      case 'first':
        this.setUpRankedPlayers();
        this.currentHand = Array.from(this.roundData.myHand.firstRoundHand);
        break;
      case 'last':
        this.currentHand = Array.from(this.roundData.myHand.firstRoundHand);
        break;
      case 'normal':
        this.currentHand = Array.from(this.roundData.myHand.myHand.hand);
        break;
      default:
        console.warn('RoundType Warning: RoundType not recognised!');
        break;
    }
    const currStage = response.roundData.roundStage;
    switch (currStage.stage) {
      case 'betting':
        setTimeout(() => {
          this.isAnimationDone = true;
          if (!currStage.madeBet) {
            this.isDealerRebet = false;
            this.openBettingModal();
          }
        }, 2000);
        this.initBettingListeners();
        break;
      case 'playing':
        setTimeout(() => {
          this.isAnimationDone = true;
        });
        this.resetPile = currStage.hitPile;
        this.initPlayingListeners(currStage);
        break;
      case 'results':
        setTimeout(() => {
          this.isAnimationDone = true;
        });
        this.rankedPlayers = Array.from(currStage.results.scoreboard);
        this.openRoundResultModal(currStage.results.roundBets);
        break;
      default:
        break;
    }
    this.isLoading = false;
  }
  private setUpRankedPlayers(): void {
    const others = this.roundData.players.map(playa => {
      return {
        name: playa.username,
        uniqueId: playa.uniqueId,
        points: 0
      };
    });
    this.rankedPlayers = [...others, { name: this.roundData.me.username, uniqueId: this.roundData.me.uniqueId, points: 0 }];
  }
  private initRoundAnimation(): void {
    this.isAnimationDone = false;
    this.animTrigger = this.animTrigger === 'initial' ? 'final' : 'initial';

    // setTimeout(() => {
    //   this.isAnimationDone = true;
    //   this.openBettingModal();
    // }, 2000);
  }
  private initBettingListeners(): void {
    console.log('initBettingListeners');
    this.bettingSubj = new Subject<any>();

    if (this.roundType !== 'normal') {
      this.listenForRound1();
    } else {
      this.listenForOthersMakingBet();
      this.listenForReveal();
    }
  }
  private initPlayingListeners(stage?: RoundStage): void {
    this.playingSubj = new Subject<any>();

    this.listenForOthersPlayingCard();
    this.listenForHitWinner();
    this.listenForRoundEnd();
    // if ure first then enable playing
    if (!stage) {
      this.canPlay = this.roundData.me.isFirst;
      return;
    }
    if (stage.nextId === this.userId || (stage.nextId === -1 && this.roundData.me.isFirst)) {
      this.canPlay = true;
    }
  }
  private listenForOthersMakingBet(): void {
    this.gameService.listenForPlayerMakingBet()
      .pipe(takeUntil(this.bettingSubj))
      .subscribe((playerBet: Bet) => {
        console.log('listenForOthersMakingBet', playerBet);
        const ind = this.roundData.players.findIndex(player => player.uniqueId === playerBet.uniqueId);
        if (ind > -1) {
          this.roundData.players[ind].status = 'Done!';
        }
      });
  }
  private listenForReveal(): void {
    this.gameService.listenForReveal()
      .pipe(
        takeUntil(this.bettingSubj)
      )
      .subscribe((response: RoundResult) => {
        console.log('listenForReveal', response);
        if (response.isDealerChangeNeeded) {
          this.userInfo = `Dealer needs to change their bet!`;
          if (this.roundData.me.isDealer) {
            this.userInfo = `You need to change your bet!`;
            this.bettingOptions = response.options;
            this.isDealerRebet = true;
            this.openBettingModal(true);
          }
        } else {
          const roundBets = response.roundBets;

          this.numCardsPlayed = 0;
          this.roundData.players.forEach(playa => playa.status = 'Waiting...');
          const firstInd = this.roundData.players.findIndex(playa => playa.isFirst);
          if (firstInd === -1) {
            this.userInfo = `It is Your turn!`;
          } else {
            this.userInfo = `It is ${this.roundData.players[firstInd].username}'s turn!`;
            this.roundData.players[firstInd].status = 'Playing card...';
          }

          this.roundData.players.forEach((_, ind, arr) => {
            const playerInd = roundBets.findIndex(bet => bet.uniqueId === _.uniqueId);
            this.roundData.players[ind].bets = Object.assign({}, roundBets[playerInd]);
          });
          this.bettingSubj.next();
          this.bettingSubj.complete();
          this.initPlayingListeners();
        }
      });
  }
  private listenForRound1(): void {
    this.gameService.listenForRound1Results()
      .pipe(takeUntil(this.bettingSubj))
      .subscribe((response: Round1APIResponse) => {
        console.log('listenForRound1', response);
        if (response.isDealerChangeNeeded) {
          this.userInfo = `Dealer needs to change their bet!`;
          if (this.roundData.me.isDealer) {
            this.bettingOptions = response.options;
            this.isDealerRebet = true;
            this.openBettingModal(true);
          }
        } else {
          // Scoreboard allocation
          this.rankedPlayers.forEach(playa => {
            playa.points = response.firstRoundData.scoreboard.find(user => user.uniqueId === playa.uniqueId).points;
          });
          this.bettingSubj.next();
          this.bettingSubj.complete();
          this.openEdgeRoundModal(
            {
              ...response.firstRoundData,
              me: this.roundData.me,
              players: this.roundData.players,
              type: this.roundType
            });
        }
      });
  }
  private listenForOthersPlayingCard(): void {
    this.gameService.listenForOthersPlayingCard()
      .pipe(takeUntil(this.playingSubj))
      .subscribe(data => {
        console.log('listenForOthersPlayingCard', data);
        if (data.card.uniqueId !== this.userId) {
          console.log(this.numCardsPlayed);
          if (this.numCardsPlayed === 0) {
            this.baseCard = Object.assign({}, data.card);
          }
          this.numCardsPlayed++;
          // card and nextId should come
          // update top card
          this.cardOnTop = Object.assign({}, data.card);
          this.roundData.players.forEach(playa => playa.status = 'Waiting...');
          // let player play card if its their nextId
          if (this.userId === data.nextId) {
            this.canPlay = true;
            this.userInfo = `It is Your turn!`;
            // get available cards
          } else {
            this.canPlay = false;
            const nextToPlay = this.roundData.players.findIndex(playa => playa.uniqueId === data.nextId);
            this.userInfo = `It is ${this.roundData.players[nextToPlay].username}'s turn!`;
            this.roundData.players[nextToPlay].status = 'Playing card...';
            // update status
          }
        }
      });
  }
  private listenForHitWinner(): void {
    this.gameService.listenForHitWinner()
      .pipe(takeUntil(this.playingSubj))
      .subscribe(data => {
        console.log('listenForHitWinner', data);
        this.cardOnTop = null;
        this.baseCard = null;
        this.roundData.players.forEach(playa => playa.status = 'Waiting...');

        // if u won u start
        if (data.winnerId === this.userId) {
          this.canPlay = true;
          this.userInfo = `You won this hand and it's your turn!`;
        } else {
          this.canPlay = false;
          const nextToPlay = this.roundData.players.findIndex(playa => playa.uniqueId === data.winnerId);
          this.userInfo = `${this.roundData.players[nextToPlay].username} won this hand and it's their turn!`;
          this.roundData.players[nextToPlay].status = 'Playing card...';


        }
      });
  }
  private listenForRoundEnd(): void {
    this.gameService.listenForRoundEnd()
      .pipe(first())
      .subscribe(data => {
        this.cardOnTop = Object.assign({}, data.lastCard);
        this.rankedPlayers = Array.from(data.scoreboard);
        this.trumpoCard = null;
        this.baseCard = null;
        this.currentHand = [];
        this.playingSubj.next();
        this.playingSubj.complete();
        this.playingSubj = new Subject<any>();
        console.log('listenForRoundEnd', data);
        // round results displayed
        this.openRoundResultModal(data.roundBets);
      });
  }
}
