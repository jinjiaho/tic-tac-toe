interface Player {
  username: string;
  id: string;
  score: number;
}

interface GameWin {
  player: string;
  combination: number[];
}

interface OXPlayers {
  [key: string]: string;
}

interface GameState {
  status: string;
  round: number;
  turn: string;
  players: OXPlayers;
  ended: boolean;
  lastMove?: number;
  win?: GameWin;
}

interface RoomState {
  players: Player[];
  game: GameState;
  watchers: string[];
}

interface RoomInitRequest {
  event: string;
  params: {
    username: string;
    roomId: string;
  }
}

interface NewRoundRequest {
  event: string;
  params: {
    roomId: string;
  }
}

export type {
  Player,
  GameWin,
  GameState,
  RoomState,
  RoomInitRequest,
  OXPlayers,
  NewRoundRequest
}