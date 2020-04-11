import { BettingModalComponent } from './betting-modal/betting-modal.component';
import { CommonModule } from '@angular/common';
import { DeckOfCardsModule } from '../features/deck-of-cards/deck-of-cards.module';
import { FormsModule } from '@angular/forms';
import { HandComponent } from './hand/hand.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RoundPileComponent } from './round-pile/round-pile.component';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  declarations: [HandComponent, RoundPileComponent, UserCardComponent, BettingModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    DeckOfCardsModule,
    PerfectScrollbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  exports: [HandComponent, RoundPileComponent, UserCardComponent]
})
export class GameResourcesModule { }
