import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../shared/modules/material.module';
import { DeckOfCardsComponent } from './deck-of-cards.component';
import { FilteringComponent } from './filtering/filtering.component';
import { CardsComponent } from './cards/cards.component';
import { CardComponent } from './cards/card/card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [DeckOfCardsComponent, FilteringComponent, CardsComponent, CardComponent],
  exports: [DeckOfCardsComponent],
})
export class DeckOfCardsModule { }
