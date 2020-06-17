import { BettingModalComponent } from './betting-modal/betting-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CorrectPlayerOrderPipe } from './pipes/correct-player-order.pipe';
import { DeckOfCardsModule } from '../features/deck-of-cards/deck-of-cards.module';
import { EdgeRoundModalComponent } from './edge-round-modal/edge-round-modal.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { OrderByPointsPipe } from './pipes/order-by-points.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RoundPileComponent } from './round-pile/round-pile.component';
import { RoundResultModalComponent } from './round-result-modal/round-result-modal.component';
import { UserCardComponent } from './user-card/user-card.component';
import { UserHandComponent } from './user-hand/user-hand.component';

@NgModule({
  declarations: [
    RoundPileComponent,
    UserCardComponent,
    BettingModalComponent,
    UserHandComponent,
    EdgeRoundModalComponent,
    OrderByPointsPipe,
    CorrectPlayerOrderPipe,
    RoundResultModalComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    DeckOfCardsModule,
    PerfectScrollbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  exports: [
    RoundPileComponent,
    UserCardComponent,
    BettingModalComponent,
    UserHandComponent,
    OrderByPointsPipe,
    CorrectPlayerOrderPipe
  ]
})
export class GameResourcesModule { }
