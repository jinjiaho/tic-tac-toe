import React from "react";
import { GetRooms } from "../../pages/api/functions";
import { GetRoomsResponse } from "../../pages/api/interfaces";
import styles from "../../styles/RoomList.module.css";
import RoomListRow from "./RoomListRow";

interface IRoomList {
  onRoomClick: (roomId: string, toPlay: boolean) => void;
  toPlay: boolean;
}

const RoomList: React.FC<IRoomList> = ({ onRoomClick, toPlay }) => {
  const [rooms, setRooms] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const data = {
      toPlay,
    };
    GetRooms(data)
      .then((res: GetRoomsResponse) => {
        console.log(`ROOMS: ${res}`);
        setRooms(res.rooms);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div>Getting rooms...</div>
      ) : (
        <div>
          {rooms.length > 0 ? (
            rooms.map((roomId, i) => (
              <RoomListRow
                key={`play_${i}`}
                text={roomId}
                onClick={() => onRoomClick(roomId, toPlay)}
              />
            ))
          ) : (
            <div>No rooms available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomList;
