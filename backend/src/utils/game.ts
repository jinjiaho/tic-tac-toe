import { START_GAME_STATE, WIN } from "../constants";
import { RoomState, SYMBOLS } from "../interfaces";

const initGame = (roomData: RoomState) => {
  roomData.game.players = {
    o: roomData.players[0].username,
    x: roomData.players[1].username
  }
  roomData.game.turn = SYMBOLS.O;
  return roomData;
}

const winRound = (roomData: RoomState, winner: string, combi: number[]) => {
  roomData.game.ended = true;
  roomData.players.map(x => {
    if (x.username === winner) {
      x.score += 1;
    }
  })
  roomData.game.win = {
    combination: combi,
    player: winner
  }
  return roomData;
}

const newRound = (roomData: RoomState) => {
  // Reset game status
  roomData.game.status = START_GAME_STATE.status;
  // Switch player order
  const prevO = roomData.players.findIndex(x => x.username === roomData.game.players.o);
  roomData.game.players = {
    o: roomData.players[+!prevO].username,
    x: roomData.players[prevO].username
  }
  // Reset to O's turn
  roomData.game.turn = SYMBOLS.O
  // Increment game round
  roomData.game.round += 1;
  // Set ended to false
  roomData.game.ended = false;
  // Remove win and last move
  roomData.game.win = undefined;
  roomData.game.lastMove = undefined;
  return roomData;
}

const playerMove = (roomData: RoomState, username: string, index: number) => {
  return new Promise<RoomState>((resolve, reject) => {
    // validete the move
    const validMove = validateMove(roomData, username, index);
    if (validMove) {
      // get the symbol
      const symbol = roomData.game.turn;
      // Replace with symbol
      const newStatus = replaceAt(roomData.game.status, symbol, index);
      roomData.game.status = newStatus;
      // Set last move
      roomData.game.lastMove = index;
      // Check if player wins
      const win = checkPlayerWin(newStatus, symbol);
      if (win) {
        roomData = winRound(roomData, username, win);
      } else if (checkDraw(newStatus)) {
        roomData.game.ended = true;
      } else {
        // Change turn
        roomData.game.turn = roomData.game.turn === SYMBOLS.O ? SYMBOLS.X : SYMBOLS.O;
      }
      resolve(roomData);
    } else {
      reject('Invalid move!');
    }
  })
}

// Ensures string will always be 9 chars long
const replaceAt = (str: string, newChar: string, index: number) => {
  const newString = str.substring(0, index) + newChar + str.substring(index + newChar.length);
  return newString;
}

const validateMove = (roomData: RoomState, username: string, index: number) => {
  // check that it's not occupied
  const notOccupied = roomData.game.status[index] === '-';
  if (!notOccupied) return false;
  // check that it's this player's turn
  if (username !== roomData.game.players[roomData.game.turn]) return false;
  return true;
}

const checkPlayerWin = (status: string, symbol: SYMBOLS) => {
  const isSymbol = [];
  // Get the indices of this symbol
  status.split('').map((x, i) => {
    if (x === symbol) {
      isSymbol.push(i);
    }
  });
  // Check against winning combinations to see if they 
  const subsets = WIN.filter(x => isSortedArrayIn(isSymbol, x))
  if (subsets.length > 0) {
    console.log(`WIN: ${subsets}`)
    return subsets[0];
  } else {
    return false;
  }
}

const checkDraw = (status: string) => {
  const newString = status.replace("-", "");
  console.log(`CHECK DRAW NEW STRING ${newString}`);
  if (newString.length < 9) {
    return false;
  }
  return true;
}

const isSortedArrayIn = (superset: number[], subset: number[]) => {
  for (let i of subset) {
    if (!superset.includes(i)) {
      return false;
    }
  }
  return true;
}

export {
  initGame,
  winRound,
  newRound,
  playerMove
}