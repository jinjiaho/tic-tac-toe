import axios from 'axios';
import { CreateRoomRequest, CreateRoomResponse, GetRoomsResponse, JoinRoomRequest, LeaveRoomRequest } from './interfaces';

const BASE_URL = `http://localhost:8000`;
const GET_ROOMS_URL = `/rooms`;
const CREATE_ROOM_URL = `/rooms/create`;
const JOIN_ROOM_URL = `/rooms/join`;
const LEAVE_ROOM_URL = `/rooms/leave`;

const axiosInstance = axios.create({ baseURL: BASE_URL });

const GetRooms = () => {
  return new Promise<GetRoomsResponse>((resolve, reject) => {
    axiosInstance({
      method: 'get',
      url: GET_ROOMS_URL
    }).then(res => {
      console.log(`GET ROOMS RESPONSE: ${JSON.stringify(res)}`);
      resolve(res.data);
    }).catch(err => {
      console.log(`ERROR GETTING ROOMS: ${JSON.stringify(err)}`)
      reject(err.response.data);
    })
  })
}

const CreateRoom = (data: CreateRoomRequest) => {
  return new Promise<CreateRoomResponse>((resolve, reject) => {
    axiosInstance({
      method: 'post',
      url: CREATE_ROOM_URL,
      data
    }).then(res => {
      console.log(`RESPONSE: ${JSON.stringify(res)}`);
      resolve(res.data)
    }).catch(err => {
      console.log(`ERROR CREATING ROOM: ${JSON.stringify(err)}`)
      reject(err.response.data)
    })
  })
}

const JoinRoom = (data: JoinRoomRequest) => {
  return new Promise<void>((resolve, reject) => {
    axiosInstance({
      method: 'post',
      url: JOIN_ROOM_URL,
      data
    }).then(() => {
      resolve();
    }).catch(err => {
      console.log(`ERROR JOINING ROOM: ${JSON.stringify(err.response)}`)
      reject(err.response.data)
    })
  })
}

const LeaveRoom = (data: LeaveRoomRequest) => {
  return new Promise<void>((resolve, reject) => {
    axiosInstance({
      method: 'post',
      url: LEAVE_ROOM_URL,
      data
    }).then(() => {
      console.log(`LEFT ROOM`);
      resolve();
    }).catch(err => {
      console.log(`ERROR LEAVING ROOM: ${err.response.data}`)
      reject();
    })
  })
}

export {
  GetRooms,
  CreateRoom,
  JoinRoom,
  LeaveRoom
}