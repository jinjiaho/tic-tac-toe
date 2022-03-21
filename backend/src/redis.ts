import { createClient } from 'redis';
import { RoomState } from './interfaces';
import pubSubManager from './pubSubManager';
const randomWords = require('random-words');

var redisClient;

const initRedis = () => {
  return new Promise<void>((resolve, reject) => {
    const url = `redis://:${process.env.REDIS_PASS}@redis:${process.env.REDIS_LOCAL_PORT}`
    redisClient = createClient({
      url
    });
  
    redisClient.on('error', (err) => {
      console.log(`REDIS CLIENT ERROR: ${err}`)
      reject(err);
    });
  
    redisClient.connect().then(() => {
      console.log("CONNECTED TO REDIS")
      resolve();
    }).catch(err => {
      console.log(`REDIS CLIENT ERROR ${err}`)
      reject(err);
    })
  })
}

const generateRoomId = async () => {
  let roomId = randomWords({ exactly: 2 }).join('-');
  const existingRoom = await redisClient.exists(roomId);
  if (existingRoom === 1) {
    roomId = await generateRoomId();
  } else {
    return roomId;
  }
  return roomId;
}

const getRooms = () => {
  return new Promise<string[]>((resolve, reject) => {
    redisClient.keys('*').then(keys => {
      console.log("KEYS", keys);
      resolve(keys);
    }).catch(err => {
      reject(err);
    })
  })
}


const createRoom = (roomData: RoomState) => {
  return new Promise<string>(async (resolve, reject) => {
    let roomId = await generateRoomId();
    console.log(`CREATED ROOM ${roomId}: ${JSON.stringify(roomData)}`);
    const roomDataStr = JSON.stringify(roomData);
    redisClient.set(roomId, roomDataStr).then(() => {
      pubSubManager.createChannel(roomId, roomDataStr);
      resolve(roomId);
    }).catch(err =>  {
      console.log(`ERROR CREATING ROOM ${roomId}: ${err}`)
      reject(err);
    });
  })
}

const getRoom = (roomId: string) => {
  return new Promise<RoomState>((resolve, reject) => {
    redisClient.get(roomId).then(val => {
      console.log(`GOT ROOM ${roomId}: ${val}`)
      if (val !== '') {
        resolve(JSON.parse(val));
      } else reject('No room data')
    }).catch(err => {
      console.log(`ROOM ${roomId} NOT FOUND: ${err}`)
      reject(err);
    })
  })
}

const saveRoom = (roomId: string, roomData: RoomState) => {
  return new Promise<RoomState>((resolve, reject) => {
    redisClient.set(roomId, JSON.stringify(roomData)).then(() => {
      console.log(`SUCCESSFULLY SET ROOM ${roomId} DATA`);
      resolve(roomData);
    }).catch(err => {
      console.log(`ERROR SAVING ROOM ${roomId} DATA: ${err}`);
      reject(err);
    })
  })
}

const checkRoomExists = async (roomId: string) => {
  const existingRoom = await redisClient.exists(roomId);
  if (existingRoom === 1) {
    return true;
  }
  return false;
}

const leaveRoom = (roomId: string, username: string) => {
  return new Promise<any>((resolve, reject) => {
    redisClient.get(roomId).then(roomDataStr => {
      const roomData = JSON.parse(roomDataStr);
      // if user leaving is a player, delete the room and return game end data
      if (roomData.players.find(x => x.username === username)) {
        redisClient.del(roomId).then(() => {
          resolve(roomData.players);
        }).catch(err => {
          reject(`ERROR DELETING ROOM: ${err}`);
        })
      } else {
        roomData.watchers = roomData.watchers.filter(x => x !== username);
        saveRoom(roomId, roomData).then(roomData => {
          resolve(roomData);
        }).catch(err => reject(`ERROR SAVING ROOM AFTER WATCHER LEAVE: ${err}`))
      }
    }).catch(err => {
      reject(`ERROR GETING ROOM: ${err}`);
    })
  })
}

const deleteAllRooms = () => {
  return new Promise<void>((resolve, reject) => {
    const promises = [];
    redisClient.keys("*").then(keys => {
      keys.map(key => promises.push(redisClient.del(key)))
    }).catch(reject)
    Promise.all(promises).then(() => {
      resolve();
    }).catch(reject);
  })
}

export {
  checkRoomExists,
  initRedis,
  createRoom,
  getRooms,
  getRoom,
  saveRoom,
  leaveRoom,
  deleteAllRooms
}