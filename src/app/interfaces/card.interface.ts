import { OthersHand } from './round.interface';

export interface Card {
    name?: string;
    value?: number;
    suit?: 'club' | 'diamond' | 'heart' | 'spade';
    uniqueId?: number;
    isAvailable?: boolean;
    hand?: Array<any>;
}
export type Hand = Array<OthersHand> | Array<Card>;

