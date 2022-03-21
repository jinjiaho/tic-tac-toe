import React from "react";
import { JoinRoom } from "../../pages/api/functions";
import UsernameForm from "../common/UsernameForm";

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
  const [sending, setSending] = React.useState(false);

  const handleFormSubmit = (username: string) => {
    if (!sending) {
      setSending(true);
      const data = { username, roomId, toPlay };
      JoinRoom(data)
        .then(() => {
          setSending(false);
          onJoinRoom(roomId, username);
        })
        .catch((err) => {
          setSending(false);
          console.log("ERROR", err);
          setErr(err);
        });
    }
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
