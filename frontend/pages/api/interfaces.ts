
interface GetRoomsRequest {
  toPlay: boolean;
}

interface GetRoomsResponse {
  rooms: string[];
}

interface CreateRoomRequest {
  username: string;
}

interface CreateRoomResponse {
  roomId: string;
}

interface JoinRoomRequest {
  username: string;
  roomId: string;
  toPlay: boolean;
}

interface LeaveRoomRequest {
  username: string;
  roomId: string;
}

export type {
  GetRoomsRequest,
  GetRoomsResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  LeaveRoomRequest
}