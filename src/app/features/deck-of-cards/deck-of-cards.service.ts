import { Injectable } from '@angular/core';
import { Card } from '../../shared/models/card.model';
import { Suit } from '../../shared/models/suit.model';

@Injectable({
  providedIn: 'root'
})
export class DeckOfCardsService {

  public deckSize = 1;
  public numberOfCards = 5;
  public minCardValue = 1;
  public maxCardValue = 10;
  public clubCheckbox = true;
  public diamondCheckbox = true;
  public heartCheckbox = true;
  public spadeCheckbox = true;

  public deck: Card[] = [];
  public cards: Card[] = [];

  constructor() {
    this.initialize();
  }

  public initialize(): void {
    this.deck = [];
    this.cards = [];
    const suits = this.getSuits();
    for (let i = 0; i < this.deckSize; i++) {
      for (let j = 2; j <= 10; j++) {
        this.generateCards(String(j), j, suits);
      }
      this.generateCards('J', 10, suits);
      this.generateCards('Q', 10, suits);
      this.generateCards('K', 10, suits);
      this.generateCards('A', 10, suits);
    }
    this.deck = this.shuffle(this.deck);
  }

  private generateCards(name: string, value: number, suits: Suit[]): void {
    for (const suit of this.getSuits()) {
      if (value < this.minCardValue || value > this.maxCardValue) {
        continue;
      }
      this.deck.push({
        name: name,
        value: value,
        suit: suit
      });
    }
  }

  private getSuits(): Suit[] {
    return Object.keys(Suit)
      .map(key => Suit[key]);
  }

  private shuffle(array: Card[]): Card[] {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  public draw(amount: number) {
    let cards: Card[] = [];
    for (let i = 0; i < amount; i++) {
      const index: number = this.deck
        .findIndex(card => {
          if (card.value < this.minCardValue || card.value > this.maxCardValue) {
            return false;
          }
          return ((this.clubCheckbox && card.suit === Suit.Club) || (this.diamondCheckbox && card.suit === Suit.Diamond)
            || (this.heartCheckbox && card.suit === Suit.Heart) || (this.spadeCheckbox && card.suit === Suit.Spade));
        });
      if (index > -1) {
        cards = cards.concat(this.deck.splice(index, 1));
      } else {
        break;
      }
    }
    this.cards = this.cards.concat(cards);
  }
}
