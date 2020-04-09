import { CommonModule } from '@angular/common';
import { DeckOfCardsModule } from '../features/deck-of-cards/deck-of-cards.module';
import { HandComponent } from './hand/hand.component';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RoundPileComponent } from './round-pile/round-pile.component';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  declarations: [HandComponent, RoundPileComponent, UserCardComponent],
  imports: [
    CommonModule,
    DeckOfCardsModule,
    PerfectScrollbarModule
  ],
  exports: [HandComponent, RoundPileComponent, UserCardComponent]
})
export class GameResourcesModule { }
