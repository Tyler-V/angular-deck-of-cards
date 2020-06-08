import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { BettingModalComponent } from '../../game-src/betting-modal/betting-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DeckOfCardsModule } from '../../features/deck-of-cards/deck-of-cards.module';
import { GameResourcesModule } from '../../game-src/game-resources.module';
import { GameRoomComponent } from './game-room.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/modules/material.module';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'ng-sidebar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DeckOfCardsModule,
    GameResourcesModule,
    SidebarModule.forRoot(),
    PerfectScrollbarModule,
    MatDialogModule
  ],
  declarations: [
    GameRoomComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    GameRoomComponent
  ]
})
export class GameRoomModule { }
