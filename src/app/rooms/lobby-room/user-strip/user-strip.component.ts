import { Component, OnInit, NgModule, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Icon } from '../../../interfaces/icon.interface';

@Component({
  selector: 'asr-user-strip',
  templateUrl: './user-strip.component.html',
  styleUrls: ['./user-strip.component.scss']
})
export class UserStripComponent implements OnInit {
  @Input() username: string;
  @Input() isReady: boolean;
  userIconSrc = '../../../../assets/user-icons/male.png';
  isMyStrip: boolean;
  selectedIcon: Icon = {
    src: '../../../../assets/user-icons/male.png',
    title: 'Male',
    selected: true
  };
  files: Icon[] = [
    {
      src: '../../../../assets/user-icons/male.png',
      title: 'Male',
      selected: true
    },
    {
      src: '../../../../assets/user-icons/female.png',
      title: 'Female'
    },
    {
      src: '../../../../assets/user-icons/anya.png',
      title: 'Anya'
    },
    {
      src: '../../../../assets/user-icons/apa.png',
      title: 'Apa'
    },
    {
      src: '../../../../assets/user-icons/freba.png',
      title: 'Freba'
    },
    {
      src: '../../../../assets/user-icons/dodo.png',
      title: 'Dodo'
    },
    {
      src: '../../../../assets/user-icons/adam.png',
      title: 'Adam'
    },
    {
      src: '../../../../../assets/user-icons/soma.png',
      title: 'Soma'
    },
];
  constructor(public modal: NgxSmartModalService) { }

  ngOnInit(): void {
    this.isMyStrip = JSON.parse(sessionStorage.getItem('user')).username === this.username;
  }
  openChangeIconModal(): void {
    if (!this.isMyStrip) {
      return;
    }
    this.modal.getModal('myModal').open();
  }
  selectIcon(title: string): void {
    const prevInd = this.files.findIndex(icon => icon.title === this.selectedIcon.title);
    if (prevInd !== -1) {
      this.files[prevInd].selected = false;
    }
    const newInd = this.files.findIndex(icon => icon.title === title);
    this.selectedIcon = Object.assign({}, this.files[newInd]);
    this.files[newInd].selected = true;
  }
  applyNewIcon(): void {
    this.userIconSrc = this.files.find(icon => icon.title === this.selectedIcon.title).src;
    this.modal.getModal('myModal').close();
  }
}
