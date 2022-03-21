import React from "react";
import Homepage from "./Homepage";
import Room from "./Room";

const App: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [roomId, setRoomId] = React.useState("");

  const handleEnterRoom = (roomId: string, username: string) => {
    setRoomId(roomId);
    setUsername(username);
  };

  const handleLeaveRoom = () => {
    setRoomId("");
    setUsername("");
  };

  React.useEffect(() => {
    console.log(`USERNAME ${username} ROOMID ${roomId}`);
  }, []);

  return (
    <>
      {roomId ? (
        <Room
          roomId={roomId}
          username={username}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <Homepage onEnterRoom={handleEnterRoom} />
      )}
    </>
  );
};

export default App;
