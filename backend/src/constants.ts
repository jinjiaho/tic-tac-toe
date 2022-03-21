import { GameState, RoomState, SYMBOLS } from "./interfaces";

const WIN = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8]
];

const START_GAME_STATE: GameState = {
  status: '---------',
  round: 0,
  turn: SYMBOLS.O,
  players: {
    o: '',
    x: '',
  },
  ended: false,
}

const START_PLAYER_DATA = {
  username: '',
  score: 0
}

export {
  WIN,
  START_GAME_STATE,
  START_PLAYER_DATA
}