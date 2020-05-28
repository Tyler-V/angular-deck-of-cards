export interface Player {
    uniqueId?: number;
    username: string;
    isHost?: boolean;
    isReady?: boolean;
    iconTitle?: string;
}

export interface UpdatedPlayer {
    id: number;
    player: Player;
}

export interface RankedPlayer {
    name: string;
    uniqueId: number;
    points: number;
}
