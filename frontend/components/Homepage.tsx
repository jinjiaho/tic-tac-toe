import React from "react";
import Modal from "./common/Modal";
import CreateRoomForm from "./HomepageComponents/CreateRoomForm";
import JoinRoomForm from "./HomepageComponents/JoinRoomForm";
import RoomList from "./HomepageComponents/RoomList";
import styles from "../styles/Homepage.module.css";

interface IHomepage {
  onEnterRoom: (roomId: string, username: string) => void;
}

const Homepage: React.FC<IHomepage> = ({ onEnterRoom }) => {
  const [showJoinRoomModal, setShowJoinRoomModal] = React.useState(false);
  const [roomSelected, setRoomSelected] = React.useState("");
  const [joinToPlay, setJoinToPlay] = React.useState(false);
  const [actionSelected, setActionSelected] = React.useState(0);

  const handleRoomClick = (roomId: string, play: boolean) => {
    setJoinToPlay(play);
    setRoomSelected(roomId);
    setShowJoinRoomModal(true);
  };

  const Play = () => (
    <div>
      <h2>Join a Room</h2>
      <RoomList onRoomClick={handleRoomClick} toPlay={true} />
      <h2>OR</h2>
      <h2>Create a Room</h2>
      <CreateRoomForm onCreateRoom={onEnterRoom} />
    </div>
  );

  const actions = [
    {
      title: "Play",
      content: <Play />,
    },
    {
      title: "Watch",
      content: <RoomList onRoomClick={handleRoomClick} toPlay={false} />,
    },
  ];

  const handleCloseJoinRoomModal = () => {
    setShowJoinRoomModal(false);
    setRoomSelected("");
  };

  const toggleAction = (index: number) => {
    if (actionSelected !== index) {
      setActionSelected(index);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.actions}>
          {actions.map((action, i) => (
            <div className={styles.action} key={`action_${i}`}>
              <div
                className={styles.actionHeader}
                onClick={() => toggleAction(i)}
              >
                <h1>{action.title}</h1>
                <h1>{actionSelected === i ? "-" : "+"}</h1>
              </div>
              {actionSelected === i && (
                <div className={styles.actionContent}>{action.content}</div>
              )}
            </div>
          ))}
        </div>
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
