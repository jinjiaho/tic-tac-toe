import { PlayerData, RoomState } from "../interfaces";

// MESSAGE CREATION
const statusMessage = (data: RoomState) => JSON.stringify({
  event: 'status',
  data
});

const errorMessage = (message: string) => JSON.stringify({
  event: 'error',
  data: message
});

const gameEndMessage = (players: PlayerData[], username: string) => JSON.stringify({
  event: 'game end',
  data: {
    players,
    left: username
  }
})

export {
  statusMessage,
  errorMessage,
  gameEndMessage
}