import { Component, Input, OnInit } from '@angular/core';

import { Bet } from '../../interfaces/round.interface';
import { IconService } from '../../services/helper-services/icon.service';

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
  @Input() role: 'First' | 'Dealer' | 'None';
  iconSrc = '../../../assets/user-icons/soma.png';
  constructor(private readonly iconService: IconService) { }

  ngOnInit(): void {
    this.iconSrc = this.iconService.getIconSrc(this.iconTitle);
  }
  getRole(): string {
    switch (this.role) {
      case 'First':
        return '(F)';
      case 'Dealer':
        return '(D)';
      default:
        return '';
    }
  }

}
