import { Component, Input } from '@angular/core';
import { Card } from '../../../../shared/models/card.model';

@Component({
  selector: 'doc-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() public card: Card;

  constructor() { }

}
