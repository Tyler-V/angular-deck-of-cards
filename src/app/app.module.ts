import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DeckOfCardsModule } from './features/deck-of-cards/deck-of-cards.module';
import { MaterialModule } from './shared/modules/material.module';
import { GameRoomComponent } from './rooms/game-room/game-room.component';
import { MenuComponent } from './rooms/menu/menu.component';
import { LobbyRoomComponent } from './rooms/lobby-room/lobby-room.component';


const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DeckOfCardsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      { path: '', component: MenuComponent },
      { path: 'lobby', component: LobbyRoomComponent },
      { path: 'game', component: GameRoomComponent },
    ])
  ],
  declarations: [
    AppComponent,
    GameRoomComponent,
    LobbyRoomComponent,
    MenuComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
