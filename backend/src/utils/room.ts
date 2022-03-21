import { RoomState } from "../interfaces";

const isInRoom = (username: string, roomData: RoomState) => {
  if (roomData.watchers.includes(username)) {
    return true;
  }
  if (roomData.players.find(x => x.username === username)) {
    return true;
  }
  return false;
}

export {
  isInRoom
}