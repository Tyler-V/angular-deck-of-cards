import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DeckOfCardsModule } from '../../features/deck-of-cards/deck-of-cards.module';
import { GameResourcesModule } from 'src/app/game-src/game-resources.module';
import { GameRoomComponent } from './game-room.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DeckOfCardsModule,
    GameResourcesModule,
    SidebarModule.forRoot()
  ],
  declarations: [
    GameRoomComponent
  ],
  providers: [],
  exports: [
    GameRoomComponent
  ]
})
export class GameRoomModule { }
