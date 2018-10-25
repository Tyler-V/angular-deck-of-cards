import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DeckOfCardsModule } from './features/deck-of-cards/deck-of-cards.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DeckOfCardsModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
