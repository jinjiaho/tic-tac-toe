import React from "react";
import { CreateRoom } from "../../pages/api/functions";
import { CreateRoomResponse } from "../../pages/api/interfaces";
import UsernameForm from "../common/UsernameForm";

interface ICreateRoomForm {
  onCreateRoom: (roomId: string, username: string) => void;
}

const CreateRoomForm: React.FC<ICreateRoomForm> = ({ onCreateRoom }) => {
  const handleFormSubmit = (username: string) => {
    const data = { username };
    CreateRoom(data)
      .then((result: CreateRoomResponse) => {
        console.log(result);
        onCreateRoom(result.roomId, username);
      })
      .catch((err) => {
        console.log(`Error creating room: ${err}`);
      });
  };

  return <UsernameForm submitText="Create Room" onSubmit={handleFormSubmit} />;
};

export default CreateRoomForm;
