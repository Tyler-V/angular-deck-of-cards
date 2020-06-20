import { Component, OnDestroy, OnInit } from '@angular/core';

import { MenuService } from '../../services/menu-service/menu.service';
import { Player } from '../../interfaces/player.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface LandingData {
  numOfPlayers: number;
  isHost?: boolean;
}

@Component({
  selector: 'doc-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  player: Player = {
    username: '',
    isReady: false,
    iconTitle: '../../../../assets/user-icons/male.png'
  };
  playersInRoom = 5;
  isJoining: boolean;
  landingData: LandingData = {
    numOfPlayers: 0,
    isHost: false
  };
  isServerOn = false;

  private _unsubscribe: Subject<any> = new Subject<any>();

  constructor(readonly menu: MenuService) { }
  ngOnInit(): void {
    this.land();
    this.initUser();
  }
  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }


  joinGame(): void {
    this.isJoining = true;
    this.menu.login(this.player);
  }
  private land(): void {
    this.menu.land()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(
        (numOfPlayers) => {
          this.isServerOn = true;
          this.landingData = { numOfPlayers };
        },
        (err) => {
          this.isServerOn = false;
        }
      );
  }
  private initUser() {
    this.player = {
      username: '',
      uniqueId: JSON.parse(sessionStorage.getItem('userId')),
      isReady: false,
      iconTitle: 'male'
    };
  }
}
