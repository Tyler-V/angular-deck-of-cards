import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Icon } from '../../../interfaces/icon.interface';
import { IconService } from '../../../services/helper-services/icon.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'asr-user-strip',
  templateUrl: './user-strip.component.html',
  styleUrls: ['./user-strip.component.scss'],
})
export class UserStripComponent implements OnInit {
  // fields
  imgSource = '../../../../assets/user-icons/male.png';
  selectedIcon: Icon = {
    src: '../../../../assets/user-icons/male.png',
    title: 'Male',
    selected: true
  };
  files: Icon[];
  modalName = 'myModal';

  // i/o
  @Input() username: string;
  @Input() isReady: boolean;
  @Input() isMyStrip: boolean;
  @Output() iconChanged: EventEmitter<string> = new EventEmitter<string>();

  private _imgTitle: string;
  get imgTitle(): string {
    return this._imgTitle;
  }

  @Input()
  set imgTitle(val: string) {
    this._imgTitle = val;
    this.imgSource = this.iconService.getIconSrc(val);
  }

  constructor(
    public modal: NgxSmartModalService,
    private readonly iconService: IconService
  ) { }

  ngOnInit(): void {
    this.modalName = this.isMyStrip ? 'myModal' : 'other';
    this.files = Array.from(this.iconService.getIcons());
  }
  openChangeIconModal(): void {
    if (!this.isMyStrip) {
      return;
    }
    const iconTitle = JSON.parse(sessionStorage.getItem('user')).iconTitle;
    this.selectIcon(iconTitle);
    this.modal.getModal('myModal').open();
  }
  selectIcon(title: string): void {
    const prevInd = this.files.findIndex(icon => icon.title === this.selectedIcon.title);
    if (prevInd !== -1) {
      this.files[prevInd].selected = false;
    }
    const newInd = this.files.findIndex(icon => icon.title.toLowerCase() === title.toLowerCase());
    this.selectedIcon = Object.assign({}, this.files[newInd]);
    this.files[newInd].selected = true;
    this.imgSource = this.iconService.getIconSrc(title);
  }
  applyNewIcon(): void {
    this.iconChanged.emit(this.selectedIcon.title);
    this.modal.getModal('myModal').close();
  }
}
