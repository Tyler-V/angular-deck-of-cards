import { CardComponent } from './cards/card/card.component';
import { CardsComponent } from './cards/cards.component';
import { CommonModule } from '@angular/common';
import { DeckOfCardsComponent } from './deck-of-cards.component';
import { FilteringComponent } from './filtering/filtering.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from '../../shared/modules/material.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatTooltipModule
  ],
  declarations: [DeckOfCardsComponent, FilteringComponent, CardsComponent, CardComponent],
  exports: [DeckOfCardsComponent, CardsComponent, CardComponent],
})
export class DeckOfCardsModule { }
