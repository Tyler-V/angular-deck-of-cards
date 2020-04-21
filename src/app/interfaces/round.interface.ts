import { Card } from '../shared/models/card.model';

export interface Bet {
    bet: number;
    hits: number;
    uniqueId?: number;
    bettingOptions?: Array<number>;
}
export interface MyHand {
    uniqueId: number;
    hand: Card[];
}
export interface OthersHand {
    uniqueId: number;
    card: Card;
}
export interface Hand {
    myHand?: MyHand;
    firstRoundHand?: OthersHand[];
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
    isHost?: boolean;
}
export interface Round {
    me: RoundPlayer;
    myHand: Hand;
    myBets: Bet;
    players: RoundPlayer[];
    trumpCard: Card;
    firstRoundData?: any;
}
