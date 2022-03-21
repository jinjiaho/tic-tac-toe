import React from "react";
import Modal from "./common/Modal";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import RoomList from "./RoomList";
import styles from "../styles/Homepage.module.css";

interface IHomepage {
  onEnterRoom: (roomId: string, username: string) => void;
}

const Homepage: React.FC<IHomepage> = ({ onEnterRoom }) => {
  const [showJoinRoomModal, setShowJoinRoomModal] = React.useState(false);
  const [roomSelected, setRoomSelected] = React.useState("");
  const [joinToPlay, setJoinToPlay] = React.useState(false);

  const handleRoomClick = (roomId: string, play: boolean) => {
    setJoinToPlay(play);
    setRoomSelected(roomId);
    setShowJoinRoomModal(true);
  };

  const handleCloseJoinRoomModal = () => {
    setShowJoinRoomModal(false);
    setRoomSelected("");
  };

  return (
    <>
      <div className={styles.container}>
        <h2>Join a Room</h2>
        <RoomList
          onJoinRoom={(roomId) => handleRoomClick(roomId, true)}
          onWatchRoom={(roomId) => handleRoomClick(roomId, false)}
        />
        <h2>OR</h2>
        <h2>Create a Room</h2>
        <CreateRoomForm onCreateRoom={onEnterRoom} />
      </div>
      {showJoinRoomModal && (
        <Modal
          title={`Join ${roomSelected}`}
          content={
            <JoinRoomForm
              roomId={roomSelected}
              toPlay={joinToPlay}
              onJoinRoom={onEnterRoom}
            />
          }
          onClose={handleCloseJoinRoomModal}
        />
      )}
    </>
  );
};

export default Homepage;
