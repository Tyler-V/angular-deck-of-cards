export interface Card {
    name?: string;
    value?: number;
    suit?: 'club' | 'diamond' | 'heart' | 'spade';
    uniqueId?: number;
    isAvailable?: boolean;
}
