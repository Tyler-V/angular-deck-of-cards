import { CommonModule } from '@angular/common';
import { DeckOfCardsModule } from '../features/deck-of-cards/deck-of-cards.module';
import { HandComponent } from './hand/hand.component';
import { NgModule } from '@angular/core';
import { RoundPileComponent } from './round-pile/round-pile.component';

@NgModule({
  declarations: [HandComponent, RoundPileComponent],
  imports: [
    CommonModule,
    DeckOfCardsModule
  ],
  exports: [HandComponent, RoundPileComponent]
})
export class GameResourcesModule { }
