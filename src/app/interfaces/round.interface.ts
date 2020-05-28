import { Card } from './card.interface';
import { RankedPlayer } from './player.interface';

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
export interface HandAPIResponse {
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

export type Stage = 'betting' | 'playing' | 'results';

export interface RoundStage {
    stage: Stage;
    madeBet?: boolean;
    nextId?: number;
    hitPile?: Array<Card>;
    results: any;
}

export interface RoundAPIResponse {
    roundData: Round;
    isLastRound: boolean;
}
export interface Round {
    me: RoundPlayer;
    myHand: HandAPIResponse;
    myBets: Bet;
    players: RoundPlayer[];
    trumpCard: Card;
    firstRoundData?: any;
    type?: RoundType;
    roundStage?: RoundStage;
}

export interface EdgeRoundResult {
    firstRoundData: FirstRoundData;
    isDealerChangeNeeded: boolean;
    options: Array<number>;
    rankedPlayers?: Array<RankedPlayer>;
}

export interface RoundResult {
    roundBets: Array<Bet>;
    isDealerChangeNeeded: boolean;
    options: Array<number>;
}
export interface Round1APIResponse {
    firstRoundData: FirstRoundAPIResponse;
    isDealerChangeNeeded: boolean;
    options: Array<number>;
}
export interface FirstRoundAPIResponse {
    cards: Array<any>;
    roundBets: Array<Bet>;
    scoreboard: Array<ScoreBoard>;
    seatIndOrder: Array<number>;
    winnerId: number;
}
export interface FirstRoundData {
    cards: Array<any>;
    roundBets: Array<Bet>;
    scoreboard: Array<ScoreBoard>;
    seatIndOrder: Array<number>;
    winnerId: number;
    type: RoundType;
    players: RoundPlayer[];
    me: RoundPlayer;
}

export interface ScoreBoard {
    name: string;
    uniqueId: number;
    points: number;
}
