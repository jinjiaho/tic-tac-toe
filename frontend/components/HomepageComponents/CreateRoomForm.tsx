import React from "react";
import { CreateRoom } from "../../pages/api/functions";
import { CreateRoomResponse } from "../../pages/api/interfaces";
import UsernameForm from "../common/UsernameForm";

interface ICreateRoomForm {
  onCreateRoom: (roomId: string, username: string) => void;
}

const CreateRoomForm: React.FC<ICreateRoomForm> = ({ onCreateRoom }) => {
  const [sending, setSending] = React.useState(false);

  const handleFormSubmit = (username: string) => {
    if (!sending) {
      setSending(true);
      const data = { username };
      CreateRoom(data)
        .then((result: CreateRoomResponse) => {
          setSending(false);
          console.log(result);
          onCreateRoom(result.roomId, username);
        })
        .catch((err) => {
          setSending(false);
          console.log(`Error creating room: ${err}`);
        });
    }
  };

  return <UsernameForm submitText="Create Room" onSubmit={handleFormSubmit} />;
};

export default CreateRoomForm;
