import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { DeckOfCardsModule } from './features/deck-of-cards/deck-of-cards.module';
import { MaterialModule } from './shared/modules/material.module';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DeckOfCardsModule,
    SocketIoModule.forRoot(config),
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
