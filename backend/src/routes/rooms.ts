var express = require('express');
var router = express.Router();
import { START_GAME_STATE, START_PLAYER_DATA } from '../constants';
import { RoomState } from '../interfaces';
import { checkRoomExists, createRoom, getRoom, getRooms, leaveRoom, saveRoom } from '../redis';
import { initGame } from '../utils/game';
import { isInRoom } from '../utils/room';

router.post('/', function(req, res, next) {
  const toPlay = req.body.toPlay;
  getRooms().then(rooms => {
    const data = {
      rooms: []
    }
    const promises = [];
    rooms.map(room => {
      promises.push(
        new Promise<void>((resolve, reject) => {
          getRoom(room).then(roomData => {
            const play = toPlay && roomData.players.length < 2;
            const watch = !toPlay && roomData.players.length > 1;
            if (play || watch) {
              data.rooms.push(room);
            }
            resolve();
          }).catch(reject)
        })
      )
    })
    // Wait for all promises to resolve
    Promise.all(promises).then(() => {
      res.status(200).send(data);
    }).catch(err => {
      res.status(500).send(err)
    })
  }).catch(err => {
    console.log(`ERROR GETTING ROOMS: ${err}`)
    res.status(500).json({
      message: `ERROR GETTING ROOMS: ${err}`
    })
  })
})

/* CREATE room */
router.post('/create', function(req, res, next) {
  const username = req.body.username;
  // init room data
  const gameData = START_GAME_STATE;
  console.log(`CREATING ROOM DATA ${JSON.stringify(gameData)}`)
  const playerData = Object.assign({}, START_PLAYER_DATA);
  playerData.username = username;
  const roomData: RoomState = {
    players: [playerData],
    watchers: [],
    game: gameData
  }

  createRoom(roomData).then((roomId: string) => {
    res.status(200).json({
      roomId
    })
  }).catch(err => {
    res.status(500).send(`ERROR CREATING ROOM ${err}`)
  })
})

router.post('/join', function(req, res, next) {
  const roomId = req.body.roomId;
  const toPlay = req.body.toPlay;
  getRoom(roomId).then(roomData => {
    console.log("JOINING ROOM", roomData);
    if (isInRoom(req.body.username, roomData)) {
      res.status(500).send(`Please select another username`)
    } else {
      switch (toPlay) {
        case true:
          if (roomData.players.length > 1) {
            console.log(`ROOM FULL`)
            res.status(500).send('2 players in room already. Refresh to watch the game in this room.')
          } else {
            const newPlayer = START_PLAYER_DATA;
            console.log(`NEW PLAYER: ${JSON.stringify(newPlayer)}`);
            newPlayer.username = req.body.username;
            roomData.players.push(newPlayer);
            // Setup game
            if (roomData.players.length === 2) {
              roomData = initGame(roomData);
            }
            saveRoom(roomId, roomData).then(() => {
              res.status(200).end();
            }).catch(err => {
              res.status(500).send(`ERROR SAVING ROOM: ${JSON.stringify(err)}`)
            })
          }
          break;
        default:
          roomData.watchers.push(req.body.username);
          saveRoom(roomId, roomData).then(() => {
            res.status(200).end();
          }).catch(err => {
            res.status(500).send(`ERROR SAVING ROOM: ${JSON.stringify(err)}`)
          })
      }
    }
  }).catch(err => {
    console.log(`ERROR JOINING ROOM ${req.body.roomId}: ${err}`)
    res.status(500).json({
      message: `ERROR JOINING ROOM: ${err}`
    })
  })
});


module.exports = router;