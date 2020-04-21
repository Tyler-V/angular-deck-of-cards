import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'asr-user-hand',
  templateUrl: './user-hand.component.html',
  styleUrls: ['./user-hand.component.scss']
})
export class UserHandComponent implements OnInit {
  @Input() cards: any[];
  @Input() isFirstRound: boolean;
  constructor() { }

  ngOnInit(): void {
    console.log(this.cards);
  }

}
