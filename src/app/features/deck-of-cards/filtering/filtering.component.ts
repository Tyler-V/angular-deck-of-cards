import { Component, OnInit } from '@angular/core';
import { DeckOfCardsService } from '../deck-of-cards.service';

@Component({
  selector: 'doc-filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss']
})
export class FilteringComponent {

  constructor(public cardService: DeckOfCardsService) { }

}
