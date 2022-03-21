import React from "react";
import { GetRooms } from "../pages/api/functions";
import { GetRoomsResponse } from "../pages/api/interfaces";

interface IRoomList {
  onJoinRoom: (roomId: string) => void;
  onWatchRoom: (roomId: string) => void;
}

const RoomList: React.FC<IRoomList> = ({ onJoinRoom, onWatchRoom }) => {
  const [playRooms, setPlayRooms] = React.useState<string[]>([]);
  const [watchRooms, setWatchRooms] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    GetRooms()
      .then((res: GetRoomsResponse) => {
        console.log(`ROOMS: ${res}`);
        setPlayRooms(res.play);
        setWatchRooms(res.watch);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <div>Getiing rooms...</div>
      ) : (
        <div>
          <h4>Play</h4>
          <div>
            {playRooms.length > 0 ? (
              playRooms.map((roomId, i) => (
                <div key={`play_${i}`} onClick={() => onJoinRoom(roomId)}>
                  {roomId}
                </div>
              ))
            ) : (
              <div>No rooms available, please create a room</div>
            )}
          </div>
          <h4>Watch</h4>
          <div>
            {watchRooms.length > 0 ? (
              watchRooms.map((roomId, i) => (
                <div key={`watch_${i}`} onClick={() => onWatchRoom(roomId)}>
                  {roomId}
                </div>
              ))
            ) : (
              <div>No games going on</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;
