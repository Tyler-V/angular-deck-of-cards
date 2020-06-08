import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'asr-betting-modal',
  templateUrl: './betting-modal.component.html',
  styleUrls: ['./betting-modal.component.scss']
})
export class BettingModalComponent implements OnInit {
  @Input() options: number[];
  @Output() betMade: EventEmitter<number> = new EventEmitter<number>();
  selected: any;

  selectedValue: number;
  constructor() {}

  ngOnInit(): void {}

  close(val: number): void {
    this.betMade.emit(val);
  }

}
