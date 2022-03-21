import React from "react";
import { JoinRoom } from "../pages/api/functions";
import UsernameForm from "./common/UsernameForm";

interface IJoinRoomForm {
  toPlay: boolean;
  roomId: string;
  onJoinRoom: (roomId: string, username: string) => void;
}

const JoinRoomForm: React.FC<IJoinRoomForm> = ({
  roomId,
  toPlay,
  onJoinRoom,
}) => {
  const [err, setErr] = React.useState("");
  const handleFormSubmit = (username: string) => {
    const data = { username, roomId, toPlay };
    JoinRoom(data)
      .then(() => {
        onJoinRoom(roomId, username);
      })
      .catch((err) => {
        console.log("ERROR", err);
        setErr(err);
      });
  };

  return (
    <UsernameForm
      error={err}
      submitText="Join Room"
      onSubmit={handleFormSubmit}
    />
  );
};

export default JoinRoomForm;
