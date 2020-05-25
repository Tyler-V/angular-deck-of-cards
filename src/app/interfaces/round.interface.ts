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
export type RoundType = 'first' | 'last' | 'normal';

export interface RoundAPIResponse {
    roundData: Round;
    isLastRound: boolean;
}
export interface Round {
    me: RoundPlayer;
    myHand: Hand;
    myBets: Bet;
    players: RoundPlayer[];
    trumpCard: Card;
    firstRoundData?: any;
}

export interface Round1Result {
    firstRoundData: FirstRoundData;
    isDealerChangeNeeded: boolean;
    options: Array<number>;
}

export interface RoundResult {
    roundBets: Array<Bet>;
    isDealerChangeNeeded: boolean;
    options: Array<number>;
}
export interface FirstRoundData {
    cards: Array<any>;
    roundBets: Array<Bet>;
    scoreboard: Array<ScoreBoard>;
    seatIndOrder: Array<number>;
    winnderId: number;
}

export interface ScoreBoard {
    name: string;
    uniqueId: number;
    points: number;
}
