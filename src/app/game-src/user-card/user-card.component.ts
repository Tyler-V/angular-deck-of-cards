import { Component, Input, OnInit } from '@angular/core';

import { Bet } from 'src/app/interfaces/round.interface';
import { IconService } from 'src/app/services/helper-services/icon.service';

@Component({
  selector: 'asr-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() name: string;
  @Input() bets: Bet;
  @Input() status: string;
  @Input() iconTitle: string;
  iconSrc = '../../../assets/user-icons/soma.png';
  constructor(private readonly iconService: IconService) { }

  ngOnInit(): void {
    this.iconSrc = this.iconService.getIconSrc(this.iconTitle);
    console.log(this.iconSrc);
  }

}
