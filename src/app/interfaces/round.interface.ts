import { Card } from '../shared/models/card.model';

export interface Bet {
    bet: number;
    hits: number;
    bettingOptions?: Array<number>;
}

export interface OthersHand {
    uniqueId: number;
    card: Card;
}
export interface Hand {
    myHand: Card[];
}
export interface RoundPlayer {
    uniqueId: number;
    username: string;
    iconTitle: string;
    bets: Bet;
    status: string;
    isDealer: boolean;
    isFirst: boolean;
    seatInd: number;
}
export interface Round {
    myHand: Hand | OthersHand[];
    myBets: Bet;
    players: RoundPlayer[];
    trumpCard: Card;
}
