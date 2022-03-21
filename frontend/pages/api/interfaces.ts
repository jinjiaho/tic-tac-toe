
interface GetRoomsResponse {
  play: string[];
  watch: string[];
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
  GetRoomsResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  LeaveRoomRequest
}