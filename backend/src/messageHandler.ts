import { MoveRequest, NewGameRequest, RoomInitRequest } from "./interfaces";
import pubSubManager from "./pubSubManager";
import { getRoom, saveRoom } from "./redis";
import { newRound, playerMove } from "./utils/game";
import { isInRoom } from "./utils/room";
import { errorMessage, statusMessage } from "./utils/websocket";

const handleNewConnection = (params: RoomInitRequest, connection: any) => {
  return new Promise<string>((resolve, reject) => {
    // Check if already subscribed
    getRoom(params.roomId).then(roomData => {
      // Check user in room
      if (!isInRoom(params.username, roomData)) {
        reject('User not in room');
        return;
      }
      const subscriber = {
        username: params.username,
        connection
      }
      const success = pubSubManager.subscribe(subscriber, params.roomId);
      if (success) {
        const message = statusMessage(roomData);
        resolve(message);
      } else {
        const err = errorMessage(`${params.username} FAILED TO SUBSCRIBE TO ${params.roomId}`)
        reject(err);
      }
    }).catch(err => {
      const error = errorMessage(`Unable to get room data: ${err}`);
      reject(error);
    });
  })
}

const handleMove = (params: MoveRequest) => {
  console.log(`NEW MOVE: ${JSON.stringify(params)}`);
  return new Promise<string>((resolve, reject) => {
    getRoom(params.roomId).then(roomData => {
      return playerMove(roomData, params.username, params.cell)
    }).then(roomData => {
      return saveRoom(params.roomId, roomData);
    }).then((roomData) => {
      resolve(statusMessage(roomData));
    }).catch(err => {
      reject(errorMessage(err))
    })
  })
}

const handleNewGame = (params: NewGameRequest) => {
  return new Promise<string>((resolve,reject) => {
    getRoom(params.roomId).then(roomData => {
      roomData = newRound(roomData);
      return saveRoom(params.roomId, roomData);
    }).then(roomData => {
      resolve(statusMessage(roomData));
    }).catch(err => {
      reject(errorMessage(err));
    })
  })
}

export {
  handleNewConnection,
  handleMove,
  handleNewGame
}