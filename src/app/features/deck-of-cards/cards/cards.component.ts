import { Component } from '@angular/core';
import { DeckOfCardsService } from '../deck-of-cards.service';

@Component({
  selector: 'doc-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {

  constructor(public cardService: DeckOfCardsService) { }

}
