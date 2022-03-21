interface PlayerData {
  username: string;
  score: number;
}

interface GameState {
  status: string;
  round: number;
  turn: SYMBOLS;
  players: {
    o: string;
    x: string;
  }
  lastMove?: number;    // cell index of last move
  win?: {
    player: string;
    combination: number[];
  }
  ended: boolean;
}

interface RoomState {
  players: PlayerData[],
  game: GameState;
  watchers: string[];
}

interface RoomInitRequest {
  roomId: string;
  username: string;
}

interface MoveRequest {
  cell: number;
  roomId: string;
  username: string;
}

interface NewGameRequest {
  roomId: string;
}

export enum SYMBOLS {
  O = 'o',
  X = 'x'
}

export type {
  PlayerData,
  GameState,
  RoomState,
  RoomInitRequest,
  MoveRequest,
  NewGameRequest
}