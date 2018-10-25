import { Suit } from './suit.model';

export interface Card {
    name: string;
    value: number;
    suit: Suit;
}
