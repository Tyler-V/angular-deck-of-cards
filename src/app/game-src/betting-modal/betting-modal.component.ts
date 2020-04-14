import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'asr-betting-modal',
  templateUrl: './betting-modal.component.html',
  styleUrls: ['./betting-modal.component.scss']
})
export class BettingModalComponent implements OnInit {
  selected: any;

  selectedValue: number;

  isLoading = true;
  options: number[];

  constructor(
    private dialogRef: MatDialogRef<BettingModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.options = data.bettingOptions;
    this.isLoading = false;
  }

  ngOnInit(): void {
  }

  close(val: number): void {
    this.dialogRef.close(val);
  }

}
