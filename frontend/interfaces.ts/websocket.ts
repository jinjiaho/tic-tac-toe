import { Player } from ".";


interface GameEndMessage {
  players: Player[];
  left: string;
}

export type {
  GameEndMessage
}