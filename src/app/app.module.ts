import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GameResourcesModule } from './game-src/game-resources.module';
import { GameRoomComponent } from './rooms/game-room/game-room.component';
import { GameRoomModule } from './rooms/game-room/game-room.module';
import { LobbyRoomComponent } from './rooms/lobby-room/lobby-room.component';
import { MaterialModule } from './shared/modules/material.module';
import { MenuComponent } from './rooms/menu/menu.component';
import { NgModule } from '@angular/core';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RouterModule } from '@angular/router';
import { UserStripComponent } from './rooms/lobby-room/user-strip/user-strip.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    GameRoomModule,
    GameResourcesModule,
    NgxSmartModalModule.forRoot(),
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      { path: '', component: MenuComponent },
      { path: 'lobby', component: LobbyRoomComponent },
      { path: 'game', component: GameRoomComponent },
    ])
  ],
  declarations: [
    AppComponent,
    LobbyRoomComponent,
    MenuComponent,
    UserStripComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
